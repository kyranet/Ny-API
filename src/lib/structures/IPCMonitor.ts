import { Piece } from '../third_party/klasa';
import { DashboardClient } from '../third_party/klasa-dashboard-hooks';
import { IPCMonitorStore } from './IPCMonitorStore';

export abstract class IPCMonitor extends Piece {

	/**
	 * The Client that manages this instance
	 */
	public client!: DashboardClient;

	/**
	 * The store that manages this instance
	 */
	public store!: IPCMonitorStore;

	public abstract async run(message: any): Promise<any>;

}
