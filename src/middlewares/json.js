const { KDH: { Middleware } } = require('../index');
const zlib = require('zlib');

module.exports = class extends Middleware {

	constructor(store) {
		super(store, { name: 'json', priority: 20 });
	}

	async run(request) {
		if (request.method !== 'POST') return;

		const stream = this.contentStream(request);
		let body = '';

		for await (const chunk of stream) body += chunk;

		const data = JSON.parse(body);
		request.body = data;
	}

	contentStream(request) {
		const length = request.headers['content-length'];
		let stream;
		switch ((request.headers['content-encoding'] || 'identity').toLowerCase()) {
			case 'deflate':
				stream = zlib.createInflate();
				request.pipe(stream);
				break;
			case 'gzip':
				stream = zlib.createGunzip();
				request.pipe(stream);
				break;
			case 'identity':
				stream = request;
				stream.length = length;
				break;
		}
		return stream;
	}

};
