import { APIClient } from '../lib/APIClient';
import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public client: APIClient;

	public run(): any {
		return this.client.broadcastRequest(['health']);
	}

}
