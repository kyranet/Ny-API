import { ServerResponse } from 'http';
import { APIClient, Sockets } from '../../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/users/:user' });
	}

	public async get(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		try {
			const user = await this.client.ipcRequest(Sockets.Skyra, ['user', request.query.user]);
			response.writeHead(200);
			response.end(JSON.stringify({ success: true, data: user }));
		} catch (error) {
			response.writeHead(error instanceof Error ? 500 : 404);
			response.end(JSON.stringify({ success: false, data: String(error) }));
		}
	}

}
