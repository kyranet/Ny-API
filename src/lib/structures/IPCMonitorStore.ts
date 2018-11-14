import { NodeMessage } from 'veza';
import { Store } from '../third_party/klasa';
import { ConstructorType, DashboardClient } from '../third_party/klasa-dashboard-hooks';
import { IPCMonitor } from './IPCMonitor';

export class IPCMonitorStore extends Store<string, IPCMonitor, ConstructorType<IPCMonitor>> {

	public constructor(client: DashboardClient) {
		super(client, 'ipcMonitors', IPCMonitor as ConstructorType<IPCMonitor>);
	}

	public async run(message: NodeMessage): Promise<any> {
		if (!message.data.route) {
			message.reply({ success: false, message: 'UNKNOWN_ROUTE' });
			return;
		}
		if (!message.data.payload) {
			message.reply({ success: false, message: 'MISSING_PAYLOAD' });
			return;
		}

		const monitor = this.get(message.data.route);
		if (!monitor) {
			message.reply({ success: false, message: 'UNKNOWN_ROUTE' });
			return;
		}

		try {
			const result = await monitor.run(message.data.payload);
			message.reply({ success: true, result });
		} catch (error) {
			message.reply({ success: false, error });
		}
	}

}
