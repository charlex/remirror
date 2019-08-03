/* eslint-disable @typescript-eslint/no-var-requires */
const baseBabel = require('./support/babel/base.babel');

module.exports = {
  ...baseBabel,
  babelrcRoots: ['.', '@remirror/*', 'docs/.babelrc.js', 'packages/*'],
  sourceType: 'unambiguous',
};
