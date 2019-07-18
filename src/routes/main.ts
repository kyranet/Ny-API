import { ServerResponse } from 'http';
import { KlasaIncomingMessage, Route, RouteStore } from '../lib/third_party/klasa-dashboard-hooks';
const reply = JSON.stringify({ success: true, data: 'OK' });

export default class extends Route {

	public constructor(store: RouteStore, file: string[], directory: string) {
		super(store, file, directory, { route: '/' });
	}

	public async get(_: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		response.writeHead(200);
		response.end(reply);
	}

}
