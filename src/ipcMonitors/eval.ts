import { inspect } from 'util';
import { IPCMonitor } from '../lib/structures/IPCMonitor';

export default class extends IPCMonitor {

	public async run(payload: string): Promise<any> {
		if (!payload) throw 'MISSING_PAYLOAD';
		try {
			return inspect(await eval(payload), { depth: 0, showProxy: true });
		} catch (error) {
			return inspect(error, { depth: 0, showProxy: true });
		}
	}

}
