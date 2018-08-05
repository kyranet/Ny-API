import { Server, RouteStore, MiddlewareStore } from "./external/klasa-dashboard-hooks";
import { IPCMonitorStore } from "./structures/IPCMonitorStore";
import { Node } from 'veza';

export default class APIClient {
	public constructor();
	public server: Server;
	public routes: RouteStore;
	public middlewares: MiddlewareStore;
	public ipcMonitors: IPCMonitorStore;
	public ipc: Node;
	public start(port: number): Promise<void>;
	public ipcRequest(data: any, receptive?: boolean): Promise<any>;
	private static walk(type: string, store: any): Promise<void>;
}
