import { invoke } from '@tauri-apps/api/tauri';
import { logger } from '@utils/logger';

export class App {
  private static instance: App;

  private constructor() {}

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  async start() {
    logger.info('Starting application...');
    await this.setupIpcHandlers();
    logger.info('Application started');
  }

  private async setupIpcHandlers() {
    try {
      await invoke('setup');
    } catch (error) {
      logger.warn('IPC setup not available in browser mode');
    }
  }

  async stop() {
    logger.info('Stopping application...');
  }
}
