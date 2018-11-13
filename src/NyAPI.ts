import { platform } from 'os';
import { APIClient } from './lib/APIClient';

const client = new APIClient();
client.ipc.serve(platform() === 'win32' ? '//./pipe/tmp/NyAPI.sock' : '/tmp/NyAPI.sock');
