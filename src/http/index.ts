import express, { Application } from 'express';
import { Server } from 'http';

import { logger } from '../config/winston';
import { mainRouter } from './routes';

const appServer: Application = express();
let httpServer: Server;

function startServer() {
  const port = process.env.PORT || 3000;
  appServer.use('/', mainRouter);
  httpServer = appServer.listen(port, () => {
    logger.log('info', `Server listening to: ${port}`);
  });
}

export { appServer, httpServer, startServer };
