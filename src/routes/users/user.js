const { KDH: { Route } } = require('../../index');

module.exports = class extends Route {

	constructor(store) {
		super(store, { name: 'users/:user' });
	}

	async get(request, response) {
		if (!request.query.user) return response.end(JSON.stringify({ success: false, message: 'MISSING_USERID' }));
		const user = await this.client.ipcRequest({ route: 'user', userID: request.query.user });
		return response.end(JSON.stringify({ success: true, message: user }));
	}

};
