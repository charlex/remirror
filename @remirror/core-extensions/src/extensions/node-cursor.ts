import {
  BaseExtensionOptions,
  Extension,
  getPluginState,
  NodeMatch,
  nodeNameMatchesList,
  ResolvedPos,
  ZERO_WIDTH_SPACE_CHAR,
} from '@remirror/core';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { NODE_CURSOR_DEFAULTS } from '../constants';

export interface NodeCursorExtensionOptions extends BaseExtensionOptions {
  targets?: NodeMatch[];
}

/**
 * This extension makes it possible to navigate with the arrow keys between nodes like emoji.
 *
 * Without it the cursor sometimes gets lost and stops responding to keypresses.
 */
export class NodeCursorExtension extends Extension<NodeCursorExtensionOptions> {
  get name() {
    return 'nodeCursor' as const;
  }

  get defaultOptions() {
    return {
      targets: NODE_CURSOR_DEFAULTS,
    };
  }

  public plugin() {
    return createNodeCursorExtensionPlugin(this);
  }
}

export const findSpecialNodeAfter = ($pos: ResolvedPos, tr: Transaction, matchers: NodeMatch[]) => {
  if (nodeNameMatchesList($pos.nodeAfter, matchers)) {
    return $pos.pos + 1;
  }

  const { parentOffset, parent } = $pos;
  const docSize = tr.doc.nodeSize - 2;

  if (parentOffset === parent.content.size && $pos.pos + 1 < docSize - 2) {
    const { nodeAfter } = tr.doc.resolve($pos.pos + 1);
    if (nodeAfter && nodeNameMatchesList(nodeAfter.firstChild, matchers)) {
      return $pos.pos + 2;
    }
  }

  return;
};

export const findSpecialNodeBefore = ($pos: ResolvedPos, tr: Transaction, matchers: NodeMatch[]) => {
  if (nodeNameMatchesList($pos.nodeBefore, matchers)) {
    return $pos.pos - 1;
  }

  if ($pos.pos === 0) {
    return;
  }

  const { parentOffset } = $pos;

  if (parentOffset === 0) {
    const { nodeBefore } = tr.doc.resolve($pos.pos - 1);
    if (nodeBefore && nodeNameMatchesList(nodeBefore.firstChild, matchers)) {
      return $pos.pos - 2;
    }
  }

  return;
};

const createNodeCursorExtensionPlugin = (ctx: NodeCursorExtension) => {
  return new Plugin({
    key: ctx.pluginKey,

    state: {
      init: () => [],
      apply(tr) {
        const { selection } = tr;
        const { $from } = selection;
        const positions: number[] = [];

        const posAfter = findSpecialNodeAfter($from, tr, ctx.options.targets);
        const posBefore = findSpecialNodeBefore($from, tr, ctx.options.targets);

        if (posAfter !== undefined) {
          positions.push(posAfter);
        }

        if (posBefore !== undefined) {
          positions.push(posBefore);
        }

        return positions;
      },
    },

    props: {
      decorations(state: EditorState) {
        const { doc } = state;
        const positions = getPluginState<number[]>(ctx.pluginKey, state);

        if (positions && positions.length) {
          const decorations = positions.map(position => {
            const node = document.createElement('span');
            node.appendChild(document.createTextNode(ZERO_WIDTH_SPACE_CHAR));
            return Decoration.widget(position, node, {
              raw: true,
              side: -1,
            } as any);
          });
          return DecorationSet.create(doc, decorations);
        }

        return null;
      },
    },
  });
};
