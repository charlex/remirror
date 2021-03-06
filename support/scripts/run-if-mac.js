const { execSync } = require('child_process');
const { environment } = require('../jest/helpers');
const { readProperty } = require('./helpers/read-config');

const ignorePostInstall = readProperty({ property: 'ignoredHooks.macPostInstall' });

const [, , ...args] = process.argv;
const command = args.join(' ');

if (!environment.isMacOS || environment.isCI) {
  console.log(`Skipping mac specific command: '${command}'`);
  process.exit(0);
}

if (ignorePostInstall) {
  console.log(
    'Mac specific commands are being ignored.\n' +
      'Set `ignoredHooks.macPostInstall` to `false`\n' +
      'in `.config.json` if you want to reactivate.',
  );
  process.exit(0);
}

console.log('Setting up your machine for mac development');
execSync(command, { stdio: 'inherit' });
