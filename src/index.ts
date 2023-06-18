import 'isomorphic-fetch'


import { initConfigs } from './config';
import { botStartup } from './bot';
import { startServer } from './http';

initConfigs();
botStartup();
startServer()

