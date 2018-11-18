import { inspect } from 'util';
import { APIClient } from './lib/APIClient';
inspect.defaultOptions.depth = 1;

const client = new APIClient({ dashboardHooks: { port: 8282 } });
client.ipc.serve(9997)
	.catch((error) => { client.console.error(error); });
client.start()
	.catch((error) => { client.console.error(error); });
