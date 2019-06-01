import { ServerResponse } from 'http';
import { DashboardClient, KlasaIncomingMessage, Middleware, MiddlewareStore } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Middleware {

	public client: DashboardClient;

	public constructor(client: DashboardClient, store: MiddlewareStore, file: string[], directory: string) {
		super(client, store, file, directory, { priority: 10 });
	}

	public async run(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
		response.setHeader('Access-Control-Allow-Headers', 'Authorization, User-Agent, Content-Type');
		if (request.method === 'OPTIONS') response.end('{"success":true}');
		else response.setHeader('Content-Type', 'application/json');
	}

}
