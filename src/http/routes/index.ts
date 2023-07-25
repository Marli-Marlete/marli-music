import { NextFunction, Request, Response, Router } from 'express';
import { join } from 'path';

import { logger } from '@/config/winston';

const mainRouter: Router = Router();

mainRouter.get(
  '/',
  (_request: Request, response: Response, next: NextFunction) => {
    const options = {
      root: join('public'),
    };
    return response.sendFile('index.html', options, (err) => {
      if (err) {
        next();
        logger.log('error', err.message);
      }
    });
  }
);

mainRouter.post('/health-check', (_request: Request, response: Response) => {
  return response.json({
    message: 'Ok',
  });
});

export { mainRouter };
