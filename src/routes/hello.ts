import { ServerResponse } from 'http';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/' });
	}

	public async get(_: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		response.end(JSON.stringify({ success: true, message: 'Hello World!' }));
	}

}
