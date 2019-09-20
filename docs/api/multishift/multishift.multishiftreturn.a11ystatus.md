<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [multishift](./multishift.md) &gt; [MultishiftReturn](./multishift.multishiftreturn.md) &gt; [a11yStatus](./multishift.multishiftreturn.a11ystatus.md)

## MultishiftReturn.a11yStatus property

This renders the status element which notifies the screen reader of changes in the text dropdown.

\*\*Important\*\*: This should always be included for accessibility purposes. \*\*Note\*\* it is spelled `a-(one one)-yStatus`<!-- -->.

```tsx
const { getComboBoxProps, allStatus } = useMultishift({ ... });

return (
  <div {...getComboBoxProps()}>
    {a11yStatus}
    // Other stuff here
  </div>
)

```

<b>Signature:</b>

```typescript
a11yStatus: ReactElement;
```