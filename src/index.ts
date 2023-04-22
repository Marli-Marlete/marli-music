import 'isomorphic-fetch';

import express, {
	Express,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express';

import { join } from 'path';
import { fileLogger, logger } from './config/winston';
import { initConfigs } from './config';
import { botStartup } from 'bot';

initConfigs();
botStartup();

const server: Express = express();
const router = Router();
server.use(router);

const port = process.env.PORT || 3000;

router.get('/', (_request: Request, response: Response, next: NextFunction) => {
	const options = {
		root: join('public'),
	};
	return response.sendFile('index.html', options, (err) => {
		if (err) {
			next();
			logger.log('error', err);
		}
	});
});

router.post('/health-check', (_request: Request, response: Response) => {
	return response.json({
		message: 'Ok',
	});
});

server.listen(port, () => {
	fileLogger.log('info', `Server listening to: ${port}`);
});
