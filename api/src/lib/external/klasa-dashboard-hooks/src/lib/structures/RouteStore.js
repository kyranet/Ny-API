const { METHODS } = require('http');

const Route = require('./Route');
const { METHODS_LOWER } = require('../util/constants');

class RouteStore extends Map {

	constructor(client) {
		super();
		this.client = client;
		this.registry = {};

		for (const method of METHODS) this.registry[method] = new Map();
	}

	findRoute(method, splitURL) {
		for (const route of this.registry[method].values()) if (route.matches(splitURL)) return route;
		return undefined;
	}

	clear() {
		for (const method of METHODS) this.registry[method].clear();
		return super.clear();
	}

	set(piece) {
		const route = super.set(piece.name, piece);
		if (!route) return piece;
		for (const method of METHODS) if (METHODS_LOWER[method] in route) this.registry[method].set(piece.name, piece);
		return route;
	}

	delete(name) {
		const route = this.resolve(name);
		if (!route) return false;
		for (const method of METHODS) this.registry[method].delete(route.name);
		return super.delete(route);
	}

	resolve(route) {
		if (route instanceof Route) return route;
		return super.get(route);
	}

}

module.exports = RouteStore;
