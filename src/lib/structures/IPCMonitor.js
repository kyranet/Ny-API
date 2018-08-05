class IPCMonitor {

	constructor(store, options = {}) {
		this.client = store.client;
		this.store = store;
		this.name = options.name;
		this.priority = options.priority;
	}

	async run(message) { // eslint-disable-line
		// Defined in extension Classes
		throw new Error(`The run method has not been implemented by IPCMonitor:${this.name}.`);
	}

}

module.exports = IPCMonitor;
