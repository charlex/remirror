import {
  Attrs,
  AttrsParams,
  CommandFunction,
  EditorSchema,
  EditorState,
  EditorStateParams,
  Extension,
  MarkExtension,
  NodeExtension,
  PlainObject,
  ProsemirrorNode,
  RemirrorActions,
  SchemaParams,
} from '@remirror/core';
import { InjectedRemirrorProps } from '@remirror/react';
import { EventType, RenderResult } from '@testing-library/react';
import { TestEditorView } from 'jest-prosemirror';
import { Node as PMNode } from 'prosemirror-model';

export interface FireParams {
  /**
   * The event to fire on the view
   */
  event: EventType;

  /**
   * Options passed into the event
   */
  options?: PlainObject;

  /**
   * Override the default position to use
   */
  position?: number;
}

export interface BaseFactoryParams extends SchemaParams, Partial<AttrsParams> {
  /**
   * The name of the node or mark
   */
  name: string;
}

/**
 * A useful feature of the builder is being able to declaratively mark positions
 * in content using the angled braces e.g. `<cursor>`.
 *
 * These positions are called tags, and are tracked on every node in the tree that has a tag on any of its descendants.
 */
export interface Tags {
  [name: string]: number;
}

/**
 * Content that contains tagged information.
 */
export type TaggedContentItem = TaggedProsemirrorNode | TagTracker;

/**
 * The data structures of the tagged content
 */
export type TaggedContent = TaggedContentItem | Array<ProsemirrorNode | TaggedContentItem>;

/**
 * Tagged content with text as well
 */
export type TaggedContentWithText = string | TaggedContent;

/**
 * ProseMirror doesn't support empty text nodes, making it difficult to
 * capture a tagged position without introducing text.
 *
 * E.g.:
 *
 *     p('<cursor>')
 *     p('Hello ', '<cursor>', 'world!')
 *
 * After the tagged syntax is stripped we're left with:
 *
 *     p('')
 *     p('Hello ', '', 'world!')
 *
 * This violates the rule of text nodes being non-empty. This class solves the
 * problem by providing an alternative data structure that *only* stores tags,
 * and can be used in scenarios where an empty text would be forbidden.
 *
 * This is done under the hood when using `text()` factory, and instead of
 * always returning a text node, it'll instead return one of two things:
 *
 * - a text node -- when given a non-empty string
 * - a tag tracker -- when given a string that *only* contains tags.
 */
export class TagTracker {
  public tags!: Tags;
}

/**
 * A standard ProseMirror Node that also tracks tags.
 */
export interface TaggedProsemirrorNode extends PMNode {
  tags: Tags;
}

export interface AddContentReturn extends EditorStateParams {
  /**
   * The actions available in the editor. When updating the content of the TestEditor make sure not to
   * use a stale copy of the actions otherwise it will throw errors due to using an outdated state.
   */
  actions: RemirrorActions;

  /**
   * The start of the current selection
   */
  start: number;

  /**
   * The end of the current selection. For a cursor selection this will be the same as the start.
   */
  end: number;

  /**
   * All custom tags that have been added  *not including* the following
   * - `<start>`
   * - `<end>`
   * - `<node>`
   * - `<cursor>`
   * - `<all>`
   * - `<anchor>`
   *
   * Which are all part of the formal cursor and selection API.
   */
  tags: Tags;

  /**
   * A function which replaces the current selection with the new content.
   *
   * This should be used to add new content to the dom.
   */
  replace(...content: string[] | TaggedProsemirrorNode[]): AddContentReturn;

  /**
   * Insert text at the current starting point for the cursor.
   * Text will be typed out with keys each firing a keyboard event.
   *
   * ! This doesn't currently support the use of tags and cursors.
   * ! Also adding multiple strings which create nodes also creates an out of position error
   */
  insertText(text: string): AddContentReturn;

  /**
   * Runs a keyboard shortcut.
   * e.g. `Mod-X`
   *
   * @param shortcut
   */
  shortcut(shortcut: string): AddContentReturn;

  /**
   * Presses a key on the keyboard.
   * e.g. `Mod-X`
   *
   * @param key - the key to press (or string representing a key)
   */
  press(key: string): AddContentReturn;

  /**
   * Takes any command as an input and dispatches it within the document context.
   *
   * @param command - the command function to run with the current state and view
   */
  dispatchCommand(command: CommandFunction): AddContentReturn;

  /**
   * Fires a custom event at the specified dom node.
   * e.g. `click`
   *
   * @param shortcut - the shortcut to type
   */
  fire(params: FireParams): AddContentReturn;

  /**
   * Simply calls add again which overwrites the whole doc
   */
  overwrite: AddContent;
}

export type AddContent = (content: TaggedProsemirrorNode) => AddContentReturn;

export type MarkWithAttrs<GNames extends string> = {
  [P in GNames]: (attrs?: Attrs) => (...content: TaggedContentWithText[]) => TaggedProsemirrorNode[];
};

export type NodeWithAttrs<GNames extends string> = {
  [P in GNames]: (attrs?: Attrs) => (...content: TaggedContentWithText[]) => TaggedProsemirrorNode;
};

export type MarkWithoutAttrs<GNames extends string> = {
  [P in GNames]: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode[];
};

export type NodeWithoutAttrs<GNames extends string> = {
  [P in GNames]: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode;
};

export type CreateTestEditorReturn<
  GPlainMarkNames extends string,
  GPlainNodeNames extends string,
  GAttrMarkNames extends string,
  GAttrNodeNames extends string
> = Omit<InjectedRemirrorProps, 'view'> & {
  view: TestEditorView;
} & {
  utils: RenderResult;
  add: AddContent;
  nodes: NodeWithoutAttrs<GPlainNodeNames>;
  marks: MarkWithoutAttrs<GPlainMarkNames>;
  attrNodes: NodeWithAttrs<GAttrNodeNames>;
  attrMarks: MarkWithAttrs<GAttrMarkNames>;
  getState(): EditorState;
  schema: EditorSchema;
};

export interface CreateTestEditorExtensions<
  GPlainMarks extends Array<MarkExtension<any, any, any>>,
  GPlainNodes extends Array<NodeExtension<any, any, any>>,
  GAttrMarks extends Array<MarkExtension<any, any, any>>,
  GAttrNodes extends Array<NodeExtension<any, any, any>>,
  GOthers extends Array<Extension<any, any, any>>
> {
  plainMarks: GPlainMarks;
  plainNodes: GPlainNodes;
  attrMarks: GAttrMarks;
  attrNodes: GAttrNodes;
  others: GOthers;
}

export interface TestEditorViewParams {
  /**
   * An instance of the test editor view which allows for dispatching events
   * and also containers TaggedProsemirrorNodes
   */
  view: TestEditorView;
}
