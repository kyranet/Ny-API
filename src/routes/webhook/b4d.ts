import { ServerResponse } from 'http';
import { B4D_TOKEN } from '../../../config';
import { APIClient, Sockets } from '../../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/users/b4d' });
	}

	public async post(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (request.headers.authorization === B4D_TOKEN) {
			response.writeHead(403);
			response.end(error);
		} else {
			const body: WebhookBody = request.body;
			if (body.type === 'vote') {
				try {
					await this.client.ipcRequest(Sockets.Skyra, { route: 'user', payload: body });
				} catch (error) {
					response.writeHead(error instanceof Error ? 500 : 400);
					response.end(JSON.stringify({ success: false, data: error }));
					return;
				}
			}
			response.writeHead(200);
			response.end(reply);
		}
	}

}

const error = JSON.stringify({ success: false, data: 'INVALID_AUTHORIZATION' });
const reply = JSON.stringify({ success: true, data: 'OK' });

/**
 * The body Bots For Discord sends
 */
type WebhookBody = {
	user: string;
	bot: string;
	votes: {
		totalVotes: number;
		votes24: number;
		votesMonth: number;
		hasVoted: string[];
		hasVoted24: string[];
	};
	type: 'vote' | 'test';
};
