import { ServerResponse } from 'http';
import { inspect } from 'util';
import { APIClient, Sockets } from '../lib/APIClient';
import { KlasaIncomingMessage, Route, RouteStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client!: APIClient;

	public constructor(store: RouteStore, file: string[], directory: string) {
		super(store, file, directory, { route: '/application', authenticated: true });
	}

	public async get(_: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		try {
			const data = await this.client.ipcRequest(Sockets.Skyra, ['application']);
			response.end(JSON.stringify({ success: true, data }));
		} catch (error) {
			response.writeHead(400);
			response.end(JSON.stringify({ success: true, data: inspect(error) }));
		}
	}

}
