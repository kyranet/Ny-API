import { APIClient } from '../lib/APIClient';
import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public client!: APIClient;

	public run() {
		return [...this.client.ipc.sockets.keys()];
	}

}
