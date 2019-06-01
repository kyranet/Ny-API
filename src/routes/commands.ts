import { ServerResponse } from 'http';
import { inspect } from 'util';
import { APIClient, Sockets } from '../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/commands' });
	}

	public async get(_: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		try {
			const commands = await this.client.ipcRequest<{ response: string }>(Sockets.Skyra, ['commands', {}]);
			response.writeHead(200);
			response.end(JSON.stringify({ success: true, data: commands }));
		} catch (error) {
			response.writeHead(500);
			response.end(JSON.stringify({ success: false, data: inspect(error) }));
		}
	}

}
