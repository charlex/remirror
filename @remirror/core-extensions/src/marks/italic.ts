import {
  CommandMarkTypeParams,
  MarkExtension,
  MarkExtensionOptions,
  MarkExtensionSpec,
  markInputRule,
  markPasteRule,
  SchemaMarkTypeParams,
} from '@remirror/core';
import { toggleMark } from 'prosemirror-commands';

export class ItalicExtension extends MarkExtension<MarkExtensionOptions, 'italic', {}> {
  get name() {
    return 'italic' as const;
  }

  get schema(): MarkExtensionSpec {
    return {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM: () => ['em', 0],
    };
  }

  public keys({ type }: SchemaMarkTypeParams) {
    return {
      'Mod-i': toggleMark(type),
    };
  }

  public commands({ type }: CommandMarkTypeParams) {
    return { italic: () => toggleMark(type) };
  }

  public inputRules({ type }: SchemaMarkTypeParams) {
    return [markInputRule({ regexp: /(?:^|[^*_])(?:\*|_)([^*_]+)(?:\*|_)$/, type })];
  }

  public pasteRules({ type }: SchemaMarkTypeParams) {
    return [markPasteRule({ regexp: /(?:^|[^*_])(?:\*|_)([^*_]+)(?:\*|_)/g, type })];
  }
}
