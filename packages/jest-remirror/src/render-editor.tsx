import React from 'react';

import {
  Attrs,
  Cast,
  Extension,
  ExtensionManager,
  isMarkExtension,
  isNodeExtension,
  MarkExtension,
  NodeExtension,
} from '@remirror/core';
import { InjectedRemirrorProps, Remirror, RemirrorProps } from '@remirror/react';
import { render } from '@testing-library/react';
import { TestEditorView } from 'jest-prosemirror';
import { AllSelection } from 'prosemirror-state';
import { markFactory, nodeFactory } from './builder';
import { jsdomSelectionPatch } from './jsdom-patch';
import { BaseExtensionNodeNames, nodeExtensions } from './test-schema';
import {
  dispatchNodeSelection,
  dispatchTextSelection,
  fireEventAtPosition,
  insertText,
  press,
  replaceSelection,
  shortcut,
} from './transactions';
import {
  AddContent,
  AddContentReturn,
  CreateTestEditorExtensions,
  CreateTestEditorReturn,
  MarkWithAttrs,
  MarkWithoutAttrs,
  NodeWithAttrs,
  NodeWithoutAttrs,
  Tags,
} from './types';

/**
 * Render the editor with the params passed in. Useful for testing.
 */
export const renderEditor = <
  GPlainMarks extends Array<MarkExtension<any, any, any>>,
  GPlainNodes extends Array<NodeExtension<any, any, any>>,
  GAttrMarks extends Array<MarkExtension<any, any, any>>,
  GAttrNodes extends Array<NodeExtension<any, any, any>>,
  GOthers extends Array<Extension<any, any, any, never>>,
  GPlainMarkNames extends GPlainMarks[number]['name'],
  GAttrMarkNames extends GAttrMarks[number]['name'],
  GAttrNodeNames extends GAttrNodes[number]['name'],
  GPlainNodeNames extends GPlainNodes[number]['name'] | BaseExtensionNodeNames,
  GReturn extends CreateTestEditorReturn<
    GPlainMarkNames,
    GPlainNodeNames,
    GAttrMarkNames,
    GAttrNodeNames
  > = CreateTestEditorReturn<
    GPlainMarkNames,
    GPlainNodeNames | BaseExtensionNodeNames,
    GAttrMarkNames,
    GAttrNodeNames
  >
>(
  {
    plainMarks = Cast<GPlainMarks>([]),
    plainNodes = Cast<GPlainNodes>([]),
    attrMarks = Cast<GAttrMarks>([]),
    attrNodes = Cast<GAttrNodes>([]),
    others = Cast<GOthers>([]),
  }: Partial<CreateTestEditorExtensions<GPlainMarks, GPlainNodes, GAttrMarks, GAttrNodes, GOthers>> = {},
  props: Partial<Omit<RemirrorProps, 'manager'>> = {},
): GReturn => {
  const extensions = [
    ...nodeExtensions,
    ...others,
    ...plainMarks,
    ...plainNodes,
    ...attrMarks,
    ...attrNodes,
  ].map(extension => ({ extension, priority: 2 }));
  const manager = ExtensionManager.create(extensions);
  let returnedParams!: InjectedRemirrorProps;
  const utils = render(
    <Remirror {...props} manager={manager}>
      {params => {
        returnedParams = params;
        if (props.children) {
          return props.children(params);
        }
        return <div />;
      }}
    </Remirror>,
  );

  const view = returnedParams.view as TestEditorView;

  const add: AddContent = taggedDoc => {
    // Work around JSDOM/Node not supporting DOM Selection API
    jsdomSelectionPatch(view);

    const { content } = taggedDoc;
    const { cursor, node, start, end, all, ...tags } = taggedDoc.tags || ({} as Tags);
    const { dispatch, state } = view;

    // Add the text to the dom
    const tr = state.tr.replaceWith(0, state.doc.nodeSize - 2, content);

    tr.setMeta('addToHistory', false);
    dispatch(tr);

    if (all) {
      view.dispatch(view.state.tr.setSelection(new AllSelection(taggedDoc)));
    } else if (node) {
      dispatchNodeSelection({ view, pos: node });
    } else if (cursor) {
      dispatchTextSelection({ view, start: cursor });
    } else if (start) {
      dispatchTextSelection({
        view,
        start,
        end: end && start <= end ? end : taggedDoc.resolve(start).end(),
      });
    }

    const updateContent = (newTags?: Tags): AddContentReturn => {
      const { from, to } = view.state.selection;
      return {
        tags: newTags ? { ...tags, ...newTags } : tags,
        start: from,
        end: to,
        replace: (...replacement) => {
          return updateContent(replaceSelection({ view, content: replacement }));
        },
        insertText: text => {
          insertText({ start: from, text, view });
          return updateContent();
        },
        overwrite: add,
        state: view.state,
        actions: returnedParams.actions,
        shortcut: text => {
          shortcut({ shortcut: text, view });
          return updateContent();
        },
        press: char => {
          press({ char, view });
          return updateContent();
        },
        dispatchCommand: command => {
          command(view.state, view.dispatch, view);
          return updateContent();
        },
        fire: params => {
          fireEventAtPosition({ view, ...params });
          return updateContent();
        },
      };
    };

    return updateContent();
  };

  const { schema } = view.state;

  const nodesWithAttrs: NodeWithAttrs<GAttrNodeNames> = Cast({});
  attrNodes.filter(isNodeExtension).forEach(({ name }) => {
    nodesWithAttrs[name as GAttrNodeNames] = (attrs: Attrs = {}) => nodeFactory({ name, schema, attrs });
  });

  const nodesWithoutAttrs: NodeWithoutAttrs<GPlainNodeNames> = Cast({
    p: nodeFactory({ name: 'paragraph', schema }),
  });
  [...plainNodes, ...nodeExtensions].filter(isNodeExtension).forEach(({ name }) => {
    nodesWithoutAttrs[name as GPlainNodeNames] = nodeFactory({ name, schema });
  });

  const marksWithAttrs: MarkWithAttrs<GAttrMarkNames> = Cast({});
  attrMarks.filter(isMarkExtension).forEach(({ name }) => {
    marksWithAttrs[name as GAttrMarkNames] = (attrs: Attrs = {}) => markFactory({ name, schema, attrs });
  });

  const marksWithoutAttrs: MarkWithoutAttrs<GPlainMarkNames> = Cast({});
  plainMarks.filter(isMarkExtension).forEach(({ name }) => {
    marksWithoutAttrs[name as GPlainMarkNames] = markFactory({ name, schema });
  });

  return Cast<GReturn>({
    ...returnedParams,
    utils,
    view,
    schema,
    getState: returnedParams.manager.getState,
    add,
    nodes: nodesWithoutAttrs,
    marks: marksWithoutAttrs,
    attrNodes: nodesWithAttrs,
    attrMarks: marksWithAttrs,
  });
};
