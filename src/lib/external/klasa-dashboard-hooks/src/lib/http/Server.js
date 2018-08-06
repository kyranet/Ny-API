const http = require('http');
const { parse } = require('url');

const { split } = require('../util/Util');
const { METHODS_LOWER } = require('../util/constants');

class Server {

	constructor(client, options = {}) {
		const { http2, sslOptions } = options;

		this.client = client;

		this.server = http2
			? require('http2').createSecureServer(sslOptions)
			: sslOptions ? require('https').createServer(sslOptions) : http.createServer();

		this.onNoMatch = this.onError.bind(this, { code: 404 });
	}

	listen(port) {
		this.server.on('request', this.handler.bind(this));
		return new Promise((res, rej) => {
			this.server.listen(port, err => err ? rej(err) : res());
		});
	}

	async handler(request, response) {
		const info = parse(request.url, true);
		const splitURL = split(info.pathname);
		const route = this.client.routes.findRoute(request.method, splitURL);

		if (route) request.params = route.execute(splitURL);
		request.originalUrl = request.originalUrl || request.url;
		request.path = info.pathname;
		request.search = info.search;
		request.query = info.query;

		try {
			await this.client.middlewares.run(request, response, route);
			await (route ? route[METHODS_LOWER[request.method]](request, response) : this.onNoMatch(request, response));
		} catch (err) {
			console.error(`[ERROR ] ${err.stack || err}`);
			this.onError(err, request, response);
		}
	}

	onError(error, request, response) {
		const code = response.statusCode = error.code || error.status || error.statusCode || 500;
		response.end((error.length && error) || error.message || http.STATUS_CODES[code]);
	}

}

module.exports = Server;
