import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public run(payload: string): any {
		return eval(payload);
	}

}
