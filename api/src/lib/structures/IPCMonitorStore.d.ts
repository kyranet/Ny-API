import { IPCMonitor } from "./IPCMonitor";
import { APIClient } from '../../../index';
import { NodeMessage } from 'veza';

export default class IPCMonitorStore extends Map<string, IPCMonitor> {
	public constructor(client: APIClient);

	/**
	 * The Client that manages this instance
	 */
	public client: APIClient;

	/**
	 * Run the IPC Monitors
	 * @param message The message received from IPC
	 */
	public run(message: NodeMessage): Promise<void>;
}
