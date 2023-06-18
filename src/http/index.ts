import express, { Application } from 'express';
import { mainRouter } from './routes';
import { logger } from '../config/winston';
import { Server } from './http';

let appServer: Application = express();
let httpServer: Server;

function startServer() {
	const port = process.env.PORT || 3000;
	appServer.use('/', mainRouter);
	httpServer = appServer.listen(port, () => {
		logger.log('info', `Server listening to: ${port}`);
	});
}

export { appServer, httpServer, startServer };
