const baseBabel = require('../babel/base.babel');
const { resolve } = require('path');

const moduleResolver = [
  'module-resolver',
  {
    alias: {
      '@remirror/core-constants': '../../@remirror/core-constants/src',
      '@remirror/core-extensions': '../../@remirror/core-extensions/src',
      '@remirror/core-helpers': '../../@remirror/core-helpers/src',
      '@remirror/core-types': '../../@remirror/core-types/src',
      '@remirror/core-utils': '../../@remirror/core-utils/src',
      '@remirror/core': '../../@remirror/core/src',
      '@remirror/dev': '../../@remirror/dev/src',
      '@remirror/editor-markdown': '../../@remirror/editor-markdown/src',
      '@remirror/editor-social': '../../@remirror/editor-social/src',
      '@remirror/editor-wysiwyg': '../../@remirror/editor-wysiwyg/src',
      '@remirror/extension-code-block': '../../@remirror/extension-code-block/src',
      '@remirror/extension-emoji': '../../@remirror/extension-emoji/src',
      '@remirror/extension-enhanced-link': '../../@remirror/extension-enhanced-link/src',
      '@remirror/extension-epic-mode': '../../@remirror/extension-epic-mode/src',
      '@remirror/extension-image': '../../@remirror/extension-image/src',
      '@remirror/extension-mention': '../../@remirror/extension-mention/src',
      '@remirror/react-node-view': '../../@remirror/react-node-view/src',
      '@remirror/react-portals': '../../@remirror/react-portals/src',
      '@remirror/react-ssr': '../../@remirror/react-ssr/src',
      '@remirror/react-utils': '../../@remirror/react-utils/src',
      '@remirror/react': '../../@remirror/react/src',
      '@remirror/renderer-react': '../../@remirror/renderer-react/src',
      '@remirror/showcase': '../../@remirror/showcase/src',
      '@remirror/ui-buttons': '../../@remirror/ui-buttons/src',
      '@remirror/ui-icons': '../../@remirror/ui-icons/src',
      '@remirror/ui-menus': '../../@remirror/ui-menus/src',
      '@remirror/ui-modal': '../../@remirror/ui-modal/src',
      '@remirror/ui': '../../@remirror/ui/src',
      remirror: '../../packages/remirror/src',
    },
    cwd: resolve(__dirname),
  },
];

module.exports = {
  ...baseBabel,
  plugins: [...baseBabel.plugins, moduleResolver],
  sourceType: 'unambiguous',
};
