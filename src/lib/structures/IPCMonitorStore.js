class IPCMonitorStore extends Map {

	constructor(client) {
		super();
		this.client = client;
	}

	async run(message) {
		if (!message.data.route) return message.reply({ success: false, message: 'UNKNOWN_ROUTE' });
		if (!message.data.payload) return message.reply({ success: false, message: 'MISSING_PAYLOAD' });

		const monitor = this.get(message.data.route);
		if (!monitor) return message.reply({ success: false, message: 'UNKNOWN_ROUTE' });

		try {
			const result = await monitor.run(message.data.payload);
			return message.reply({ success: true, message: clean(result) });
		} catch (error) {
			return message.reply({ success: false, message: clean(error) });
		}
	}

	set(piece) {
		super.set(piece.name, piece);
		return piece;
	}

}

const { inspect } = require('util');

function clean(result) {
	switch (typeof result) {
		case 'number':
		case 'string': return result;
		case 'undefined': return 'undefined';
		case 'function': return result.toString();
		default: return inspect(result, { depth: 0 });
	}
}

module.exports = IPCMonitorStore;
