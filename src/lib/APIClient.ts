import { Node } from 'veza';
import { IPCMonitorStore } from './structures/IPCMonitorStore';
import { DashboardClient, DashboardClientOptions } from './third_party/klasa-dashboard-hooks';
import { Colors, ConsoleTexts } from './third_party/klasa/lib/util/Colors';

const g = new Colors({ text: ConsoleTexts.green }).format('[IPC   ]');
const y = new Colors({ text: ConsoleTexts.yellow }).format('[IPC   ]');
const r = new Colors({ text: ConsoleTexts.red }).format('[IPC   ]');

export class APIClient extends DashboardClient {
	public ipcMonitors = new IPCMonitorStore(this);
	public ipc = new Node('ny-api')
		.on('client.identify', (client) => { this.console.log(`${g} Client Connected: ${client.name}`); })
		.on('client.disconnect', (client) => { this.console.log(`${y} Client Disconnected: ${client.name}`); })
		.on('client.destroy', (client) => { this.console.log(`${y} Client Destroyed: ${client.name}`); })
		.on('server.ready', (server) => { this.console.log(`${g} Client Ready: Named ${server.name}`); })
		.on('error', (error, client) => { this.console.error(`${r} Error from ${client.name}`, error); })
		.on('message', this.ipcMonitors.run.bind(this.ipcMonitors));

	public constructor(options?: DashboardClientOptions) {
		super(options);
		this.registerStore(this.ipcMonitors);
	}

	public async ipcRequest<T>(socket: Sockets, body: [string, any?], receptive: boolean = true): Promise<T> {
		const [success, data] = await this.ipc.sendTo<[boolean, T]>(socket, body, { receptive, timeout: 10000 });
		if (success) return data;
		else throw data;
	}

	public broadcastRequest<T>(data: [string, any?], receptive: boolean = true): Promise<T[]> {
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
