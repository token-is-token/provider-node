import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { logger } from '@utils/logger';
import { UsageTracker } from './UsageTracker';
import { RequestHandler } from './RequestHandler';

export interface ProxyConfig {
  port: number;
  host?: string;
}

export class ProxyServer {
  private app: Express;
  private server: Server | null = null;
  private config: ProxyConfig | null = null;
  private usageTracker: UsageTracker;
  private requestHandler: RequestHandler | null = null;

  constructor() {
    this.app = express();
    this.usageTracker = new UsageTracker();
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req: Request, res: Response, next) => {
      logger.debug('Proxy request', { method: req.method, path: req.path });
      next();
    });
  }

  async start(port: number): Promise<void> {
    this.config = { port };

    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(port, () => {
          logger.info('Proxy server started', { port });
          resolve();
        });

        this.server.on('error', (error: NodeJS.ErrnoException) => {
          if (error.code === 'EADDRINUSE') {
            logger.error(`Port ${port} is already in use`);
            reject(new Error(`Port ${port} is already in use`));
          } else {
            logger.error('Proxy server error', error);
            reject(error);
          }
        });
      } catch (error) {
        logger.error('Failed to start proxy server', error);
        reject(error);
      }
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((error) => {
        if (error) {
          logger.error('Error stopping proxy server', error);
          reject(error);
        } else {
          logger.info('Proxy server stopped');
          resolve();
        }
      });
    });
  }

  handleRequest(req: Request, res: Response): void {
    if (!this.requestHandler) {
      res.status(500).json({ error: 'Request handler not configured' });
      return;
    }

    const requestId = req.headers['x-request-id'] as string || Date.now().toString();
    const usage = this.usageTracker.startTracking(requestId);

    this.requestHandler
      .handle(req)
      .then((response) => {
        this.usageTracker.stopTracking(requestId);
        res.status(200).json(response);
      })
      .catch((error) => {
        this.usageTracker.stopTracking(requestId);
        logger.error('Request handling failed', { requestId, error });
        res.status(500).json({ error: error.message });
      });
  }

  setRequestHandler(handler: RequestHandler): void {
    this.requestHandler = handler;
  }

  getUsage(): Map<string, any> {
    return this.usageTracker.getUsage();
  }

  getPort(): number {
    return this.config?.port ?? 0;
  }
}
