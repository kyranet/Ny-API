// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { createServer as createHttpServer, IncomingMessage, Server as HTTPServer, ServerResponse, STATUS_CODES } from 'http';
import { createSecureServer as createHttp2Server, Http2SecureServer } from 'http2';
import { createServer as createHttpsServer, Server as HTTPSServer } from 'https';
import { ParsedUrlQuery } from 'querystring';
import { parse } from 'url';
import { DashboardClient } from '../DashboardClient';
import { HttpMethods } from '../structures/RouteStore';
import { METHODS_LOWER } from '../util/constants';
import { split } from '../util/Util';

/**
 * The extended KlasaIncomingMessage type
 */
export type KlasaIncomingMessage = {
	/**
	 * The original URL
	 */
	originalUrl: string;
	/**
	 * The entire path section of the URL, including the `host`, `port`... and
	 * before the `query`/`hash` components
	 */
	path: string;
	/**
	 * The entire query string portion of the URL including the leading ASCII
	 * question mark (`?`) character
	 */
	search: string;
	/**
	 * The collection of key and value pairs parsed from the query string portion
	 */
	query: ParsedUrlQuery;
	/**
	 * The method used for this message
	 */
	method: keyof typeof HttpMethods;
	/**
	 * The params used for this incoming message
	 */
	params: Record<string, any>;
	/**
	 * The parsed body, only available after the JSON middleware has run
	 */
	body?: any;
	/**
	 * The auth data
	 */
	auth?: {
		/**
		 * The access token
		 */
		token: string;
		/**
		 * The scope
		 */
		scope: string[];
	};
} & IncomingMessage;

/**
 * An error-like object
 */
interface ErrorLike {
	code: number;
	status?: number;
	statusCode?: number;
	message?: string;
}
/**
 * The http server for klasa-dashboard-hooks
 */
export class Server {

	/**
	 * The Client that manages this Server instance
	 */
	public client: DashboardClient;

	/**
	 * The http.Server instance that manages the HTTP requests
	 */
	public server: HTTPServer | HTTPSServer | Http2SecureServer;

	/**
	 * The onError function called when a url does not match
	 */
	public onNoMatch = this.onError.bind(this, { code: 404 });

	/**
	 * @param client The Klasa client
	 */
	public constructor(client: DashboardClient) {
		const { http2, sslOptions } = client.options.dashboardHooks;
		this.client = client;
		this.server = http2
			? createHttp2Server(sslOptions!)
			: sslOptions ? createHttpsServer(sslOptions) : createHttpServer();
	}

	/**
	 * Starts the server listening to a port
	 * @param port The port to run the server on
	 */
	public listen(port: number): Promise<void> {
		this.server.on('request', this.handler.bind(this));
		return new Promise(resolve => {
			this.server.listen(port, resolve);
		});
	}

	/**
	 * The handler for incoming requests
	 * @param request The request
	 * @param response The response
	 */
	public async handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
		const info = parse(request.url!, true);
		const splitURL = split(info.pathname!);
		const route = this.client.routes.findRoute(request.method as keyof typeof HttpMethods, splitURL);

		const klasaRequest = request as KlasaIncomingMessage;
		if (route) klasaRequest.params = route.execute(splitURL);
		klasaRequest.originalUrl = klasaRequest.originalUrl || request.url!;
		klasaRequest.path = info.pathname!;
		klasaRequest.search = info.search!;
		klasaRequest.query = info.query;

		try {
			await this.client.middlewares.run(klasaRequest, response, route!);
			await (route ? route[METHODS_LOWER[request.method!]](request, response) : this.onNoMatch(klasaRequest, response));
		} catch (err) {
			this.client.console.error(err);
			this.onError(err, klasaRequest, response);
		}
	}

	/**
	 * The handler for errors
	 * @param error error The error
	 * @param request The request
	 * @param response The response
	 */
	public onError(error: ErrorLike, _: KlasaIncomingMessage, response: ServerResponse): void {
		response.statusCode = error.code || error.status || error.statusCode || 500;
		response.end(error.message || STATUS_CODES[response.statusCode]);
	}

}
