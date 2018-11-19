import { inspect } from 'util';
import { CLIENT_OPTIONS } from '../config';
import { APIClient } from './lib/APIClient';
inspect.defaultOptions.depth = 1;

const client = new APIClient(CLIENT_OPTIONS);
client.ipc.serve(9997)
	.catch((error) => { client.console.error(error); });
client.start()
	.catch((error) => { client.console.error(error); });
