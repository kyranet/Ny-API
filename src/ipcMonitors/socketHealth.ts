import { APIClient, Sockets } from '../lib/APIClient';
import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public client: APIClient;

	public run(payload: Sockets): any {
		if (!payload) throw 'MISSING_PAYLOAD';
		return this.client.ipcRequest(payload, ['health']);
	}

}
