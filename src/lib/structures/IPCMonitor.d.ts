import APIClient from "../../../../../../..";
import Route from "./Route";
import IPCMonitorStore from "./IPCMonitorStore";
import { NodeMessage } from 'veza'

/**
 * Base class for all IPC monitors.
 */
export default abstract class IPCMonitor {
	public constructor(store: IPCMonitorStore, options?: IPCMonitorOptions);

	/**
	 * The Client that manages this instance
	 */
	public client: APIClient;

	/**
	 * The store that manages this instance
	 */
	public store: IPCMonitor;

	/**
	 * The name of this IPC monitor
	 */
	public name: string;

	/**
	 * The run method to be overwritten in actual IPC monitor handlers
	 * @param message The message obtained from IPC
	 */
	public abstract run(message: NodeMessage): Promise<void>;
}

export type IPCMonitorOptions = {
	name: string;
};
