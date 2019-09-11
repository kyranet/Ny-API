import { APIClient } from '../lib/APIClient';
import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public client!: APIClient;

	public run(payload: string) {
		if (!payload) throw 'MISSING_PAYLOAD';
		return this.client.ipc.sockets.has(payload);
	}

}
