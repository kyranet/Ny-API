import { ServerResponse } from 'http';
import { APIClient, Sockets } from '../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/invite' });
	}

	public async get(_: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		try {
			const link = await this.client.ipcRequest<{ response: string }>(Sockets.Skyra, ['invite']);
			response.writeHead(200);
			response.end(JSON.stringify({ success: true, data: link }));
		} catch (error) {
			response.writeHead(500);
			response.end(JSON.stringify({ success: false, data: String(error) }));
		}
	}

}
