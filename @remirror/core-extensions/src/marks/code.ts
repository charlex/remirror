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

export class CodeExtension extends MarkExtension<MarkExtensionOptions, 'code', {}> {
  get name() {
    return 'code' as const;
  }

  get schema(): MarkExtensionSpec {
    return {
      parseDOM: [{ tag: 'code' }],
      toDOM: () => ['code', 0],
    };
  }

  public keys({ type }: SchemaMarkTypeParams) {
    return {
      'Mod-`': toggleMark(type),
    };
  }

  public commands({ type }: CommandMarkTypeParams) {
    return { code: () => toggleMark(type) };
  }

  public inputRules({ type }: SchemaMarkTypeParams) {
    return [markInputRule({ regexp: /(?:`)([^`]+)(?:`)$/, type })];
  }

  public pasteRules({ type }: SchemaMarkTypeParams) {
    return [markPasteRule({ regexp: /(?:`)([^`]+)(?:`)/g, type })];
  }
}
