import { Config } from '@jest/types';
import { SupportedServers } from '@test-fixtures/test-urls';
import { JestDevServerOptions, setup, teardown } from 'jest-dev-server';
import onExit from 'signal-exit';

const { teardown: teardownPuppeteer } = require('jest-environment-puppeteer');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const { PUPPETEER_SERVERS, CI } = process.env;
const __SERVERS__: SupportedServers[] = PUPPETEER_SERVERS
  ? (PUPPETEER_SERVERS.split(',') as SupportedServers[])
  : ['next', 'docz', 'storybook'];

const serverConfig: Record<SupportedServers, JestDevServerOptions> = {
  storybook: {
    command: `yarn storybook:${CI ? 'ci' : 'test'}`,
    port: 3002,
    usedPortAction: 'kill',
    launchTimeout: 120000,
  },
  next: {
    command: 'yarn next:ci',
    port: 3001,
    usedPortAction: 'kill',
    launchTimeout: 120000,
  },
  docz: {
    command: 'yarn dev:docs',
    port: 3000,
    usedPortAction: 'kill',
    launchTimeout: 120000,
  },
};

let serverSetupPromise: Promise<void> | undefined;

export async function setupServer(globalConfig: Config.GlobalConfig) {
  await setup(__SERVERS__.map(server => serverConfig[server]));

  onExit(() =>
    Promise.all([teardown(), teardownPuppeteer()]).then(() => {
      process.exit();
    }),
  );

  await setupPuppeteer(globalConfig);
}

export async function startServer(globalConfig: Config.GlobalConfig) {
  if (serverSetupPromise) {
    return serverSetupPromise;
  } else {
    serverSetupPromise = setupServer(globalConfig);
    return serverSetupPromise;
  }
}
export async function destroyServer(globalConfig: Config.GlobalConfig) {
  serverSetupPromise = undefined;
  await teardown();
  await teardownPuppeteer(globalConfig);
}
