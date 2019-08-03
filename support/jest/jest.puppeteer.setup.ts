import { Config } from '@jest/types';
import { startServer } from './puppeteer';

export default async function globalSetup(globalConfig: Config.GlobalConfig): Promise<void> {
  await startServer(globalConfig);
}
