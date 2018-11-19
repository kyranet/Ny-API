import { ServerResponse } from 'http';
import { DashboardClient, decrypt, KlasaIncomingMessage, Middleware, MiddlewareStore, RESPONSES, Route } from '../lib/third_party/klasa-dashboard-hooks';

export default class extends Middleware {

	public client: DashboardClient;

	public constructor(client: DashboardClient, store: MiddlewareStore, file: string[], directory: string) {
		super(client, store, file, directory, { priority: 100 });
	}

	public async run(request: KlasaIncomingMessage, response: ServerResponse, route: Route): Promise<void> {
		if (!route || !route.authenticated) return;
		try {
			request.auth = decrypt(request.headers.authorization, this.client.options.clientSecret);
			if (request.method === 'POST' && !request.auth.scope.includes(request.body.id)) throw true;
		} catch (err) {
			this.unauthorized(response);
		}
	}

	public unauthorized(response: ServerResponse): void {
		response.writeHead(401);
		response.end(RESPONSES.UNAUTHORIZED);
	}

}
