const { join } = require('path');

const core = require('./@remirror/core/package.json');
const coreExtensions = require('./@remirror/core-extensions/package.json');
const editorTwitter = require('./@remirror/editor-twitter/package.json');
const editorWysiwyg = require('./@remirror/editor-wysiwyg/package.json');
const extensionCodeBlock = require('./@remirror/extension-code-block/package.json');
const extensionCollaboration = require('./@remirror/extension-collaboration/package.json');
const extensionEmoji = require('./@remirror/extension-emoji/package.json');
const extensionEpicMode = require('./@remirror/extension-epic-mode/package.json');
const extensionEnhancedLink = require('./@remirror/extension-enhanced-link/package.json');
const extensionMention = require('./@remirror/extension-mention/package.json');
const react = require('./@remirror/react/package.json');
const reactSSR = require('./@remirror/react-ssr/package.json');
const reactUtils = require('./@remirror/react-utils/package.json');
const rendererReact = require('./@remirror/renderer-react/package.json');
const showcase = require('./@remirror/showcase/package.json');

const limits = {
  '@remirror/core': '60 KB',
  '@remirror/core-extensions': '100 KB',
  '@remirror/editor-twitter': '250 KB',
  '@remirror/editor-wysiwyg': '400 KB',
  '@remirror/extension-code-block': '110 KB',
  '@remirror/extension-collaboration': '60 KB',
  '@remirror/extension-emoji': '220 KB',
  '@remirror/extension-epic-mode': '60 KB',
  '@remirror/extension-enhanced-link': '70 KB',
  '@remirror/extension-mention': '80 KB',
  '@remirror/react': '120 KB',
  '@remirror/react-ssr': '90 KB',
  '@remirror/react-utils': '60 KB',
  '@remirror/renderer-react': '70 KB',
  '@remirror/showcase': '400 KB',
};

module.exports = [
  core,
  coreExtensions,
  extensionCodeBlock,
  extensionCollaboration,
  extensionEmoji,
  extensionEpicMode,
  extensionEnhancedLink,
  extensionMention,
  react,
  reactSSR,
  reactUtils,
  rendererReact,
  showcase,
  editorTwitter,
  editorWysiwyg,
].map(json => ({
  name: json.name,
  path: join(json.name, json.main),
  limit: limits[json.name],
  ignore: Object.keys(json.peerDependencies || {}),
}));
