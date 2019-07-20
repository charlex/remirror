import { InputRule } from 'prosemirror-inputrules';
import { Fragment, Node as PMNode, Slice } from 'prosemirror-model';
import { Plugin, TextSelection } from 'prosemirror-state';
import { GetAttrsParams, MarkTypeParams, NodeTypeParams, RegExpParams } from '../types';
import { findMatches, isFunction } from './base';

/**
 * Creates an input rule based on the provided regex for the provided mark type
 */
export const markInputRule = ({ regexp, type, getAttrs }: MarkInputRuleParams) => {
  return new InputRule(regexp, (state, match, start, end) => {
    const { tr } = state;
    const attrs = isFunction(getAttrs) ? getAttrs(match) : getAttrs;

    let markEnd = end;

    if (match[1]) {
      const startSpaces = match[0].search(/\S/);
      const textStart = start + match[0].indexOf(match[1]);
      const textEnd = textStart + match[1].length;

      if (textEnd < end) {
        tr.delete(textEnd, end);
      }

      if (textStart > start) {
        tr.delete(start + startSpaces, textStart);
      }

      markEnd = start + startSpaces + match[1].length;
    }

    return (
      tr
        .addMark(start, markEnd, type.create(attrs))
        // Make sure not to continue with any ongoing marks
        .removeStoredMark(type)
    );
  });
};

/**
 * Creates a paste rule based on the provided regex for the provided mark type
 */
export const markPasteRule = ({ regexp, type, getAttrs }: MarkInputRuleParams) => {
  const handler = (fragment: Fragment) => {
    const nodes: PMNode[] = [];

    fragment.forEach(child => {
      if (child.isText) {
        const text = child.text || '';
        let pos = 0;

        // ? For some reason including the index param makes this work. I'm not sure why...?
        findMatches(text, regexp).forEach((match, _) => {
          if (!match[1]) {
            return;
          }

          const start = match.index;
          const end = start + match[0].length;
          const attrs = isFunction(getAttrs) ? getAttrs(match) : getAttrs;

          if (start > 0) {
            nodes.push(child.cut(pos, start));
          }

          nodes.push(child.cut(start, end).mark(type.create(attrs).addToSet(child.marks)));

          pos = end;
        });

        if (text && pos < text.length) {
          nodes.push(child.cut(pos));
        }
      } else {
        nodes.push(child.copy(handler(child.content)));
      }
    });

    return Fragment.fromArray(nodes);
  };

  return new Plugin({
    props: {
      transformPasted: slice => new Slice(handler(slice.content), slice.openStart, slice.openEnd),
    },
  });
};

/**
 * Creates an node input rule based on the provided regex for the provided node type
 */
export const nodeInputRule = ({ regexp, type, getAttrs, updateSelection = false }: NodeInputRuleParams) => {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = isFunction(getAttrs) ? getAttrs(match) : getAttrs;
    const { tr } = state;

    tr.replaceWith(start - 1, end, type.create(attrs!));

    if (updateSelection) {
      const $pos = tr.doc.resolve(start);
      tr.setSelection(new TextSelection($pos));
    }
    return tr;
  });
};

interface NodeInputRuleParams extends Partial<GetAttrsParams>, RegExpParams, NodeTypeParams {
  /**
   * Allows for setting a text selection at the start of the newly created node.
   * Leave blank or set to false to ignore.
   */
  updateSelection?: boolean;
}

interface MarkInputRuleParams extends Partial<GetAttrsParams>, RegExpParams, MarkTypeParams {}
