import { app } from '@tauri-apps/api/globals';
import { logger } from '@utils/logger';
import { NodeManager } from '@core/node/NodeManager';
import { ConfigManager } from './config/ConfigManager';

const nodeManager = NodeManager.getInstance();
const configManager = ConfigManager.getInstance();

export async function main() {
  logger.info('Provider Node starting...');

  try {
    const config = await configManager.load();
    await nodeManager.initialize(config);
    logger.info('Provider Node initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Provider Node', error);
    process.exit(1);
  }

  app.onBeforeUnload(async () => {
    logger.info('Provider Node shutting down...');
    await nodeManager.stop();
  });
}
