const Middleware = require('./Middleware');


class MiddlewareStore extends Map {

	constructor(client) {
		super();
		this.client = client;
		this.sortedMiddlewares = [];
	}

	clear() {
		this.sortedMiddlewares = [];
		return super.clear();
	}

	set(piece) {
		const middleware = super.set(piece.name, piece);
		if (!middleware) return middleware;
		const index = this.sortedMiddlewares.findIndex(mid => mid.priority >= middleware.priority);
		this.sortedMiddlewares.splice(index === -1 ? 0 : index, 0, middleware);
		return middleware;
	}

	delete(name) {
		const middleware = this.resolve(name);
		if (!middleware) return false;
		this.sortedMiddlewares.splice(this.sortedMiddlewares.indexOf(middleware), 1);
		return super.delete(middleware);
	}

	async run(request, response, route) {
		for (const middleware of this.sortedMiddlewares) {
			if (response.finished) return;
			if (middleware.enabled) await middleware.run(request, response, route);
		}
	}

	resolve(middleware) {
		if (middleware instanceof Middleware) return middleware;
		return super.get(middleware);
	}

}

module.exports = MiddlewareStore;
