import React, { FC, PureComponent } from 'react';

import { config } from '@fortawesome/fontawesome-svg-core';
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  OrderedListExtension,
  SSRHelperExtension,
  StrikeExtension,
  UnderlineExtension,
} from '@remirror/core-extensions';
import { CodeBlockExtension } from '@remirror/extension-code-block';
import { ManagedRemirrorProvider, RemirrorExtension, RemirrorManager, useRemirror } from '@remirror/react';
import { asDefaultProps, RemirrorManagerProps } from '@remirror/react-utils';
import deepMerge from 'deepmerge';
import { ThemeProvider } from 'emotion-theming';
import { wysiwygEditorTheme } from '../theme';
import { WysiwygEditorProps } from '../types';
import { BubbleMenu, BubbleMenuProps, MenuBar } from './menu';
import { EditorWrapper, InnerEditorWrapper } from './styled';

import bash from 'refractor/lang/bash';
import markdown from 'refractor/lang/markdown';
import tsx from 'refractor/lang/tsx';
import typescript from 'refractor/lang/typescript';

const defaultPlaceholder: RemirrorManagerProps['placeholder'] = [
  'Start typing...',
  {
    color: '#aaa',
    fontStyle: 'normal',
    position: 'absolute',
    fontWeight: 300,
    letterSpacing: '0.5px',
  },
];

interface State {
  linkActivated: boolean;
}

// This is need to support FontAwesome in server side rendering
// TODO Refactor to use built in react svg icons
// @see https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-486052785
config.autoAddCss = false;

const DEFAULT_LANGUAGES = [markdown, typescript, tsx, bash];

export class WysiwygEditor extends PureComponent<WysiwygEditorProps> {
  public static defaultProps = asDefaultProps<WysiwygEditorProps>()({
    placeholder: defaultPlaceholder,
    theme: {},
    removeFontAwesomeCSS: false,
  });

  public state: State = {
    linkActivated: false,
  };

  private activateLink = () => {
    this.setState({ linkActivated: true });
  };

  private deactivateLink = () => {
    this.setState({ linkActivated: false });
  };

  get editorTheme() {
    return deepMerge(wysiwygEditorTheme, this.props.theme || {});
  }

  get supportedLanguages() {
    return [...DEFAULT_LANGUAGES, ...(this.props.supportedLanguages || [])];
  }

  public render() {
    const { theme: _, placeholder, removeFontAwesomeCSS, ...props } = this.props;

    return (
      <ThemeProvider theme={this.editorTheme}>
        <RemirrorManager placeholder={placeholder}>
          <RemirrorExtension Constructor={BoldExtension} />
          <RemirrorExtension Constructor={UnderlineExtension} />
          <RemirrorExtension Constructor={ItalicExtension} />
          <RemirrorExtension Constructor={BlockquoteExtension} />
          <RemirrorExtension Constructor={LinkExtension} activationHandler={this.activateLink} />
          <RemirrorExtension Constructor={StrikeExtension} />
          <RemirrorExtension Constructor={CodeExtension} />
          <RemirrorExtension Constructor={HeadingExtension} />
          <RemirrorExtension Constructor={HorizontalRuleExtension} />
          <RemirrorExtension Constructor={ImageExtension} />
          <RemirrorExtension Constructor={ListItemExtension} />
          <RemirrorExtension Constructor={BulletListExtension} />
          <RemirrorExtension Constructor={OrderedListExtension} />
          <RemirrorExtension Constructor={HardBreakExtension} />
          <RemirrorExtension Constructor={CodeBlockExtension} supportedLanguages={this.supportedLanguages} />
          <RemirrorExtension Constructor={SSRHelperExtension} />
          <ManagedRemirrorProvider {...props}>
            <InnerEditor
              injectFontAwesome={!removeFontAwesomeCSS}
              linkActivated={this.state.linkActivated}
              deactivateLink={this.deactivateLink}
              activateLink={this.activateLink}
            />
          </ManagedRemirrorProvider>
        </RemirrorManager>
      </ThemeProvider>
    );
  }
}

interface InnerEditorProps extends BubbleMenuProps {
  /**
   * Whether to inject the font awesome styles.
   *
   * @default true
   */
  injectFontAwesome: boolean;
}

const InnerEditor: FC<InnerEditorProps> = ({
  linkActivated,
  deactivateLink,
  activateLink,
  injectFontAwesome,
}) => {
  const { getRootProps } = useRemirror();

  return (
    <EditorWrapper>
      {injectFontAwesome && (
        <link rel='stylesheet' href='https://unpkg.com/@fortawesome/fontawesome-svg-core@1.2.19/styles.css' />
      )}
      <MenuBar activateLink={activateLink} />
      <BubbleMenu linkActivated={linkActivated} deactivateLink={deactivateLink} activateLink={activateLink} />
      <InnerEditorWrapper {...getRootProps()} data-testid='remirror-wysiwyg-editor' />
    </EditorWrapper>
  );
};
