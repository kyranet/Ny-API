const { parse } = require('../util/Util');

class Route {

	constructor(store, options = {}) {
		this.client = store.client;
		this.store = store;
		this.name = options.name;
		this.authenticated = options.authenticated;
		this.parsed = parse(this.name);
	}

	matches(split) {
		if (split.length !== this.parsed.length) return false;
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 0 && this.parsed[i].val !== split[i]) return false;
		return true;
	}

	execute(split) {
		const params = {};
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 1) params[this.parsed[i].val] = split[i];
		return params;
	}

}

module.exports = Route;
