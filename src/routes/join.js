const { KDH: { Route } } = require('../index');

module.exports = class extends Route {

	constructor(store) {
		super(store, { name: 'join' });
	}

	async get(request, response) {
		const link = await this.client.ipcRequest({ route: 'join' });
		return response.end(JSON.stringify({ success: true, message: link }));
	}

};
