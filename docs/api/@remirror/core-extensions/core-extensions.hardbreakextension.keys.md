<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@remirror/core-extensions](./core-extensions.md) &gt; [HardBreakExtension](./core-extensions.hardbreakextension.md) &gt; [keys](./core-extensions.hardbreakextension.keys.md)

## HardBreakExtension.keys() method

<b>Signature:</b>

```typescript
keys({ type }: ExtensionManagerNodeTypeParams): {
        'Mod-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(p1: import("prosemirror-state").EditorState<S>, p2?: ((tr: import("prosemirror-state").Transaction<S>) => void) | undefined, p3?: import("prosemirror-view").EditorView<S> | undefined) => boolean;
        'Shift-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(p1: import("prosemirror-state").EditorState<S>, p2?: ((tr: import("prosemirror-state").Transaction<S>) => void) | undefined, p3?: import("prosemirror-view").EditorView<S> | undefined) => boolean;
    };
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  { type } | <code>ExtensionManagerNodeTypeParams</code> |  |

<b>Returns:</b>

`{
        'Mod-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(p1: import("prosemirror-state").EditorState<S>, p2?: ((tr: import("prosemirror-state").Transaction<S>) => void) | undefined, p3?: import("prosemirror-view").EditorView<S> | undefined) => boolean;
        'Shift-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(p1: import("prosemirror-state").EditorState<S>, p2?: ((tr: import("prosemirror-state").Transaction<S>) => void) | undefined, p3?: import("prosemirror-view").EditorView<S> | undefined) => boolean;
    }`
