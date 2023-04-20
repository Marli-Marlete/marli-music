import express, { Express, Request, Response, Router } from 'express';
import { botStartup } from 'bot';

const server: Express = express();
const router = Router();
server.use(router);

const port = process.env.PORT || 3000;

router.get('/', (_request: Request, response: Response) => {
	return response.sendFile('./public/index.html', { root: '.' });
});

router.post('/health-check', (_request: Request, response: Response) => {
	return response.json({
		message: 'Ok',
	});
});

server.listen(port, () => {
	botStartup();
	console.log(`Server listening to: ${port}`);
});
