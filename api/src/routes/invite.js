const { KDH: { Route } } = require('../../index');

module.exports = class extends Route {

	constructor(store) {
		super(store, { name: 'invite' });
	}

	async get(request, response) {
		const link = await this.client.ipcRequest({ route: 'invite' });
		return response.end(JSON.stringify({ success: true, message: link }));
	}

};
