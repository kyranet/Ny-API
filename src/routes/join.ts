import { ServerResponse } from 'http';
import { APIClient } from '../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/join' });
	}

	public async get(_: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		const link = await this.client.ipcRequest<{ response: string }>({ route: 'join' });
		return response.end(JSON.stringify({ success: true, message: link.response }));
	}

}
