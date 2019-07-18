import { ServerResponse } from 'http';
import { inspect } from 'util';
import { B4D_TOKEN } from '../../../config';
import { APIClient, Sockets } from '../../lib/APIClient';
import { KlasaIncomingMessage, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

const invalidAuthorization = JSON.stringify({ success: false, data: 'INVALID_AUTHORIZATION' });
const reply = JSON.stringify({ success: true, data: 'OK' });

export default class extends Route {

	public client!: APIClient;

	public constructor(store: RouteStore, file: string[], directory: string) {
		super(store, file, directory, { route: '/webhooks/b4d' });
	}

	public async post(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (request.headers.authorization === B4D_TOKEN) {
			const { body } = request;
			if (body.type === 'vote') {
				try {
					await this.client.ipcRequest(Sockets.Skyra, ['webhook', { ...body, from: 'b4d' }]);
				} catch (error) {
					response.writeHead(error instanceof Error ? 500 : 400);
					response.end(JSON.stringify({ success: false, data: inspect(error) }));
					return;
				}
			}
			response.writeHead(200);
			response.end(reply);
		} else {
			response.writeHead(403);
			response.end(invalidAuthorization);
		}
	}

}
