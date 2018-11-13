import { ServerResponse } from 'http';
import { APIClient } from '../../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { name: '/users/:user' });
	}

	public async get(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (!request.query.user) return response.end(JSON.stringify({ success: false, message: 'MISSING_USERID' }));
		const user = await this.client.ipcRequest({ route: 'user', userID: request.query.user });
		return response.end(JSON.stringify({ success: true, message: user }));
	}

}
