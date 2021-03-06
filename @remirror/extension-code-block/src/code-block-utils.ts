import {
  Attrs,
  bool,
  CommandFunction,
  EditorState,
  findParentNodeOfType,
  flattenArray,
  FromToParams,
  isEqual,
  isObject,
  isString,
  NodeType,
  NodeTypeParams,
  NodeWithPosition,
  PMNodeParams,
  PosParams,
  TextParams,
  uniqueArray,
} from '@remirror/core';
import { Decoration } from 'prosemirror-view';
import refractor, { RefractorNode, RefractorSyntax } from 'refractor/core';
import { CodeBlockAttrs, CodeBlockFormatter } from './code-block-types';

// Refractor languages
import clike from 'refractor/lang/clike';
import css from 'refractor/lang/css';
import js from 'refractor/lang/javascript';
import markup from 'refractor/lang/markup';

interface ParsedRefractorNode extends TextParams {
  /**
   * The classes that will wrap the node
   */
  classes: string[];
}

interface PositionedRefractorNode extends FromToParams, ParsedRefractorNode {}

/**
 * Maps the refractor nodes into text and classes which will be used to create our decoration.
 */
function parseRefractorNodes(
  refractorNodes: RefractorNode[],
  className: string[] = [],
): ParsedRefractorNode[][] {
  return refractorNodes.map(node => {
    const classes = [
      ...className,
      ...(node.type === 'element' && node.properties.className ? node.properties.className : []),
    ];

    if (node.type === 'element') {
      return parseRefractorNodes(node.children, classes) as any;
    }

    return {
      text: node.value,
      classes,
    };
  });
}

/**
 * Creates a decoration set for the provided blocks
 */
export const createDecorations = (blocks: NodeWithPosition[], skipLast: boolean) => {
  const decorations: Decoration[] = [];

  blocks.forEach(block => {
    const positionedRefractorNodes = getPositionedRefractorNodes(block);
    const lastBlockLength = skipLast ? positionedRefractorNodes.length - 1 : positionedRefractorNodes.length;
    for (let ii = 0; ii < lastBlockLength; ii++) {
      const positionedRefractorNode = positionedRefractorNodes[ii];
      const decoration = Decoration.inline(positionedRefractorNode.from, positionedRefractorNode.to, {
        class: positionedRefractorNode.classes.join(' '),
      });
      decorations.push(decoration);
    }
  });

  return decorations;
};

/**
 * Retrieves positioned refractor nodes from the positionedNode
 *
 * @param nodeWithPosition - a node and position
 * @returns the positioned refractor nodes which are text, classes and a FromTo interface
 */
const getPositionedRefractorNodes = ({ node, pos }: NodeWithPosition) => {
  let startPos = pos + 1;
  const refractorNodes = refractor.highlight(node.textContent, node.attrs.language);
  function mapper(refractorNode: ParsedRefractorNode): PositionedRefractorNode {
    const from = startPos;
    const to = from + refractorNode.text.length;
    startPos = to;
    return {
      ...refractorNode,
      from,
      to,
    };
  }

  const parsedRefractorNodes = parseRefractorNodes(refractorNodes);

  return flattenArray<ParsedRefractorNode>(parsedRefractorNodes).map(mapper);
};

interface PosWithinRangeParams extends PosParams, FromToParams {}

/**
 * Check if the position is within the range.
 */
export const posWithinRange = ({ from, to, pos }: PosWithinRangeParams) => from <= pos && to >= pos;

/**
 * Check whether the length of an array has changed
 */
export const lengthHasChanged = <GType>(prev: ArrayLike<GType>, next: ArrayLike<GType>) =>
  next.length !== prev.length;

export interface NodeInformation extends NodeTypeParams, FromToParams, PMNodeParams, PosParams {}

/**
 * Retrieves helpful node information from the current state.
 */
export const getNodeInformationFromState = (state: EditorState): NodeInformation => {
  const { $head } = state.selection;
  const depth = $head.depth;
  const from = $head.start(depth);
  const to = $head.end(depth);
  const node = $head.parent;
  const type = node.type;
  const pos = depth > 0 ? $head.before(depth) : 0;
  return {
    from,
    to,
    type,
    node,
    pos,
  };
};

/**
 * Updates the node attrs.
 *
 * This is used to update the language for the codeBlock.
 */
export const updateNodeAttrs = (type: NodeType) => (attrs?: Attrs): CommandFunction => (
  { tr, selection },
  dispatch,
) => {
  if (!isValidCodeBlockAttrs(attrs)) {
    throw new Error('Invalid attrs passed to the updateAttrs method');
  }

  const parent = findParentNodeOfType({ types: type, selection })!;

  if (!parent || isEqual(attrs, parent.node.attrs)) {
    // Do nothing since the attrs are the same
    return false;
  }

  tr.setNodeMarkup(parent.pos, type, attrs);

  if (!dispatch) {
    return true;
  }

  dispatch(tr);
  return true;
};

export const formatCodeBlockFactory = (
  _type: NodeType,
  formatter: CodeBlockFormatter,
) => (): CommandFunction => state => {
  // Check if block is type is active, if not return false

  // Get the `language`, `source` and `cursorOffset` for the block
  // For cursor position it might be okay to just use the current position.
  const format = formatter({ source: '', language: '', cursorOffset: state.selection.from });
  if (!format) {
    return false;
  }

  // const { cursorOffset, output } = format;

  // Replace the node content with the transformed text.

  // Set the new selection
  return true;
};

/**
 * Check that the attributes exist and are valid for the codeBlock updateAttrs.
 */
export const isValidCodeBlockAttrs = (attrs?: Attrs): attrs is CodeBlockAttrs =>
  bool(attrs && isObject(attrs) && isString(attrs.language) && attrs.language.length);

const AUTO_LOADED_LANGUAGES = [markup, clike, css, js];

/**
 * Retrieve the supported language names based on configuration.
 */
export const getSupportedLanguagesMap = (supportedLanguages: RefractorSyntax[]) => {
  const obj: Record<string, string> = {};
  for (const { name, aliases } of [...AUTO_LOADED_LANGUAGES, ...supportedLanguages]) {
    obj[name] = name;
    aliases.forEach(alias => {
      obj[alias] = name;
    });
  }
  return obj;
};

/**
 * The list of strings that are recognised language names based on the the configured
 * supported languages
 */
export const getLanguageNamesAndAliases = (supportedLanguages: RefractorSyntax[]) => {
  return uniqueArray(
    flattenArray(
      [...AUTO_LOADED_LANGUAGES, ...supportedLanguages].map(({ name, aliases }) => [name, ...aliases]),
    ),
  );
};

/**
 * Returns true if the language is supported.
 */
export const isSupportedLanguage = (language: string, supportedLanguages: RefractorSyntax[]) => {
  return getLanguageNamesAndAliases(supportedLanguages).includes(language);
};

interface GetLanguageParams {
  /**
   * The language input from the user;
   */
  language: string;

  /**
   * The languages supported by the editor.
   */
  supportedLanguages: RefractorSyntax[];

  /**
   * The default language to use if none found.
   */
  fallback: string;
}

/**
 * Get the language from user input.
 */
export const getLanguage = ({ language, supportedLanguages, fallback }: GetLanguageParams) => {
  let lang = language;

  if (!isSupportedLanguage(lang, supportedLanguages)) {
    lang = fallback;
  }

  return getSupportedLanguagesMap(supportedLanguages)[lang];
};
