const { KDH: { Route } } = require('../../index');

module.exports = class extends Route {

	constructor(store) {
		super(store, { name: 'hello' });
	}

	async get(request, response) {
		return response.end(JSON.stringify({ success: true, message: 'Hello World!' }));
	}

};