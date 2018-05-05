const { inspect } = require('util');

class MessageHandler {

	constructor(client) {
		this.client = client;
	}

	get fileManager() {
		return this.client.fileManager;
	}

	run(message) {
		const { data } = message;
		return typeof this[data.route] === 'function'
			? this[data.route](message)
			: message.reply({ success: false, code: 404, type: 'UNKNOWN_ROUTE', name: data.route });
	}

	async cryptoSave(message) {
		const filename = Date.now().toString(16);
		const { type = 'MESSAGE_GIST', text } = message.data;
		const key = await this.fileManager.encryptFile(filename, JSON.stringify({ type, text }));
		message.reply({ filename, key });
	}

	async cryptoRead(message) {
		try {
			const content = await this.fileManager.decryptFile(message.data.filename, message.data.key);
			message.reply({ content });
		} catch (error) {
			message.reply({ success: false, code: 403, type: 'CRYPTOREAD_ERROR', error });
		}
	}

	async cryptoDelete(message) {
		try {
			await this.fileManager.destroyFile(message.data.filename);
			message.reply({ success: true });
		} catch (error) {
			message.reply({ success: false, code: 403, type: 'CRYPTODELETE_ERROR', error });
		}
	}

	async eval(message) {
		try {
			const result = await eval(message.data.code);
			message.reply({ success: true, result: clean(result) });
		} catch (error) {
			message.reply({ success: false, code: 403, type: 'EVAL_ERROR', error });
		}
	}

}

function clean(result) {
	switch (typeof result) {
		case 'number':
		case 'string': return result;
		case 'undefined': return 'undefined';
		case 'function': return result.toString();
		default: return inspect(result, { depth: 0 });
	}
}

module.exports = MessageHandler;
