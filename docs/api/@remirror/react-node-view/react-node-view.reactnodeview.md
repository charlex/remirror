<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@remirror/react-node-view](./react-node-view.md) &gt; [ReactNodeView](./react-node-view.reactnodeview.md)

## ReactNodeView class

<b>Signature:</b>

```typescript
export declare class ReactNodeView<GOptions extends BaseExtensionOptions = BaseExtensionOptions, GAttrs extends Attrs = Attrs> implements NodeView 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)({ Component, getPosition, node, portalContainer, view, options, })](./react-node-view.reactnodeview._constructor_.md) |  | Constructs a new instance of the <code>ReactNodeView</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [contentDOM](./react-node-view.reactnodeview.contentdom.md) |  | <code>Node &#124; undefined</code> |  |
|  [dom](./react-node-view.reactnodeview.dom.md) |  | <code>HTMLElement &#124; undefined</code> | Provides readonly access to the dom element |
|  [node](./react-node-view.reactnodeview.node.md) |  | <code>NodeWithAttrs&lt;GAttrs&gt;</code> | The ProsemirrorNode that this nodeView is responsible for rendering. |
|  [view](./react-node-view.reactnodeview.view.md) |  | <code>EditorView</code> | The editor this nodeView belongs to. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [createDomRef()](./react-node-view.reactnodeview.createdomref.md) |  | Create a dom ref |
|  [createNodeView({ Component, portalContainer, options })](./react-node-view.reactnodeview.createnodeview.md) | <code>static</code> | A shorthand method for creating the ReactNodeView |
|  [deselectNode()](./react-node-view.reactnodeview.deselectnode.md) |  |  |
|  [destroy()](./react-node-view.reactnodeview.destroy.md) |  | This is called whenever the node is being destroyed. |
|  [getContentDOM()](./react-node-view.reactnodeview.getcontentdom.md) |  | Override this method in order to return a content dom which allow |
|  [init()](./react-node-view.reactnodeview.init.md) |  | This method exists to move initialization logic out of the constructor, so the object can be initialized properly before calling render first time.<!-- -->Example: Instance properties get added to an object only after super call in constructor, which leads to some methods being undefined during the first render. |
|  [render(forwardRef)](./react-node-view.reactnodeview.render.md) |  |  |
|  [selectNode()](./react-node-view.reactnodeview.selectnode.md) |  | Marks the node as being selected |
|  [setDomAttrs(node, element)](./react-node-view.reactnodeview.setdomattrs.md) |  | Copies the attributes from a ProseMirror Node to a DOM node. |
|  [update(node, \_, validUpdate)](./react-node-view.reactnodeview.update.md) |  |  |
