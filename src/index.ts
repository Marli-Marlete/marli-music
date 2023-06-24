import { botStartup } from './bot';
import { initConfigs } from './config';
import { startServer } from './http';

initConfigs();
botStartup();
startServer();
