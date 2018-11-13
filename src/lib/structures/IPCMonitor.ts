import { NodeMessage } from 'veza';
import { Piece } from '../third_party/klasa';
import { DashboardClient } from '../third_party/klasa-dashboard-hooks';
import { IPCMonitorStore } from './IPCMonitorStore';

export class IPCMonitor extends Piece {

	/**
	 * The Client that manages this instance
	 */
	public client: DashboardClient;

	/**
	 * The store that manages this instance
	 */
	public store: IPCMonitorStore;

	public async run(_: NodeMessage): Promise<any> {
		throw new Error(`The run method has not been implemented by IPCMonitor: ${this.name}.`);
	}

}
