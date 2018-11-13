import { ServerResponse } from 'http';
import { APIClient } from '../../../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../../../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { name: '/users/:user/settings' });
	}

	public async get(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (!request.query.user) return response.end(JSON.stringify({ success: false, message: 'MISSING_USERID' }));
		const configs = await this.client.ipcRequest({ route: 'userConfigs', userID: request.query.user });
		return response.end(JSON.stringify({ success: true, message: configs }));
	}

	public async post(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (typeof request.query.user !== 'string') return response.end(JSON.stringify({ success: false, message: 'MISSING_USERID' }));

		// if (!request.headers.authorization || !allowedSocialTokens.includes(request.headers.authorization)) {
		response.writeHead(403);
		return response.end(JSON.stringify({ success: false, message: 'DENIED_ACCESS' }));
		// }

		// if (!('amount' in request.body)) {
		// 	response.writeHead(403);
		// 	return response.end(JSON.stringify({ success: false, message: 'MISSING_ARGUMENT', argument: 'amount' }));
		// }

		// if (!('action' in request.body)) {
		// 	request.body.action = 'set';
		// } else if (!ACTION_TYPES.has(request.body.action)) {
		// 	response.writeHead(403);
		// 	return response.end(JSON.stringify({ success: false, message: 'INVALID_TYPE', argument: 'action' }));
		// }

		// if (!('type' in request.body)) {
		// 	request.body.type = 'money';
		// } else if (!TYPE_TYPES.has(request.body.type)) {
		// 	response.writeHead(403);
		// 	return response.end(JSON.stringify({ success: false, message: 'INVALID_TYPE', argument: 'type' }));
		// }

		// // @ts-ignore
		// try {
		// 	const data = await this.client.ipcRequest<{ response: any }>({
		// 		action: request.body.action,
		// 		amount: request.body.amount,
		// 		route: 'postUserConfigs',
		// 		type: request.body.type,
		// 		userID: request.query.user
		// 	});
		// 	return response.end(JSON.stringify({ success: true, message: data.response }));
		// } catch (error) {
		// 	response.writeHead(400);
		// 	return response.end(JSON.stringify({ success: false, message: error }));
		// }
	}

}

// const ACTION_TYPES = new Set(['set', 'add', 'remove']);
// const TYPE_TYPES = new Set(['money', 'points']);
