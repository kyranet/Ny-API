import { ServerResponse } from 'http';
import { inspect } from 'util';
import { Sockets, APIClient } from '../lib/APIClient';
import { KlasaIncomingMessage, Route, RouteStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client!: APIClient;

	public constructor(store: RouteStore, file: string[], directory: string) {
		super(store, file, directory, { route: '/join' });
	}

	public async get(_: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		try {
			const link = await this.client.ipcRequest<{ response: string }>(Sockets.Skyra, ['join']);
			response.writeHead(200);
			response.end(JSON.stringify({ success: true, data: link }));
		} catch (error) {
			response.writeHead(500);
			response.end(JSON.stringify({ success: false, data: inspect(error) }));
		}
	}

}
