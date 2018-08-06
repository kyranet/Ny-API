const { KDH: { Route } } = require('../../../index');
const { api: { allowedSocialTokens } } = require('../../../../config');

module.exports = class extends Route {

	constructor(store) {
		super(store, { name: 'users/:user/configs' });
	}

	async get(request, response) {
		if (!request.query.user) return response.end(JSON.stringify({ success: false, message: 'MISSING_USERID' }));
		const configs = await this.client.ipcRequest({ route: 'userConfigs', userID: request.query.user });
		return response.end(JSON.stringify({ success: true, message: configs }));
	}

	async post(request, response) {
		if (!request.query.user) return response.end(JSON.stringify({ success: false, message: 'MISSING_USERID' }));

		if (!request.headers.authorization || !allowedSocialTokens.includes(request.headers.authorization)) {
			response.writeHead(403);
			return response.end(JSON.stringify({ success: false, message: 'DENIED_ACCESS' }));
		}

		if (!('amount' in request.body)) {
			response.writeHead(403);
			return response.end(JSON.stringify({ success: false, message: 'MISSING_ARGUMENT', argument: 'amount' }));
		}

		if (!('action' in request.body)) {
			request.body.action = 'set';
		} else if (!ACTION_TYPES.has(request.body.action)) {
			response.writeHead(403);
			return response.end(JSON.stringify({ success: false, message: 'INVALID_TYPE', argument: 'action' }));
		}

		if (!('type' in request.body)) {
			request.body.type = 'money';
		} else if (!TYPE_TYPES.has(request.body.type)) {
			response.writeHead(403);
			return response.end(JSON.stringify({ success: false, message: 'INVALID_TYPE', argument: 'type' }));
		}

		// @ts-ignore
		try {
			const data = await this.client.ipcRequest({
				route: 'postUserConfigs',
				userID: request.user.id,
				type: request.body.type,
				action: request.body.action,
				amount: request.body.amount
			});
			return response.end(JSON.stringify({ success: true, message: data.response }));
		} catch (error) {
			response.writeHead(400);
			return response.end(JSON.stringify({ success: false, message: error }));
		}
	}

};

const ACTION_TYPES = new Set(['set', 'add', 'remove']);
const TYPE_TYPES = new Set(['money', 'points']);
