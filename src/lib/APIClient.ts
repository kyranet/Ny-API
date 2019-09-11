import { Server as VezaServer } from 'veza';
import { DashboardClient, DashboardClientOptions } from './third_party/klasa-dashboard-hooks';
import { Colors, ConsoleTexts } from './third_party/klasa/lib/util/Colors';
import { IPCMonitorStore } from './structures/IPCMonitorStore';

const g = new Colors({ text: ConsoleTexts.green }).format('[IPC   ]');
const y = new Colors({ text: ConsoleTexts.yellow }).format('[IPC   ]');
const r = new Colors({ text: ConsoleTexts.red }).format('[IPC   ]');

export class APIClient extends DashboardClient {

	public ipcMonitors = new IPCMonitorStore(this);
	public ipc = new VezaServer('ny-api')
		.on('open', () => { this.console.log(`${g} Server Opened`); })
		.on('close', () => { this.console.error(`${g} Server Closed`); })
		.on('disconnect', client => { this.console.log(`${y} Disconnected: ${client.name}`); })
		.on('connect', client => { this.console.log(`${g} Ready ${client.name}`); })
		.on('error', (error, client) => { this.console.error(`${r} Error from ${(client && client.name) || 'Unknown'}`, error); })
		.on('message', this.ipcMonitors.run.bind(this.ipcMonitors));

	public constructor(options?: DashboardClientOptions) {
		super(options);
		this.registerStore(this.ipcMonitors);
	}

	public async ipcRequest<T>(socket: Sockets, body: [string, unknown?], receptive: boolean = true): Promise<T> {
		const [success, data] = await this.ipc.sendTo(socket, body, { receptive, timeout: 10000 }) as [boolean, T];
		if (success) return data;
		throw data;
	}

	public broadcastRequest<T>(data: [string, unknown?], receptive: boolean = true): Promise<T[]> {
		return this.ipc.broadcast(data, { receptive, timeout: 10000 });
	}

}

/**
 * The sockets this IPC handler can send to
 */
export enum Sockets {
	/**
	 * The socket name for Skyra
	 */
	Skyra = 'skyra-master',
	/**
	 * The socket name for Aelia
	 */
	Aelia = 'aelia-master',
	/**
	 * The socket name for Alestra
	 */
	Alestra = 'alestra-master',
	/**
	 * The socket name for Evlyn
	 */
	Evlyn = 'evlyn-master'
}
