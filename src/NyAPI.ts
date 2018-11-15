import { platform } from 'os';
import { inspect } from 'util';
import { APIClient } from './lib/APIClient';
inspect.defaultOptions.depth = 1;

const client = new APIClient({ dashboardHooks: { port: 8282 } });
client.ipc.serve(platform() === 'win32' ? '//./pipe/tmp/NyAPI.sock' : '/tmp/NyAPI.sock')
	.catch((error) => { client.console.error(error); });
client.start()
	.catch((error) => { client.console.error(error); });
