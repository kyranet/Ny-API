class Middleware {

	constructor(store, options = {}) {
		this.client = store.client;
		this.store = store;
		this.name = options.name;
		this.priority = options.priority;
	}

	async run(request, response, route) { // eslint-disable-line
		// Defined in extension Classes
		throw new Error(`The run method has not been implemented by Middleware:${this.name}.`);
	}

}

module.exports = Middleware;
