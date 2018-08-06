const { IPCMonitor } = require('../index');

module.exports = class extends IPCMonitor {

	constructor(store) {
		super(store, { name: 'eval' });
	}

	run(payload) {
		return eval(payload);
	}

};
