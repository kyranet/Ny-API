import { APIClient } from '../../../../../../..';
import { Http2SecureServer } from 'http2';
import { Server, IncomingMessage, ServerResponse } from 'http';

export class Server {
	public constructor(client: APIClient);

	/**
	 * The Client that manages this Server instance
	 */
	public client: APIClient;

	/**
	 * The http.Server instance that manages the HTTP requests
	 */
	public server: Http2SecureServer | Server;

	/**
	 * The onError function called when a url does not match
	 */
	public onNoMatch: (request: KlasaIncomingMessage, response: ServerResponse) => void;

	/**
	 * Starts the server listening to a port
	 * @param port The port to run the server on
	 */
	public listen(port: number): Promise<void>;

	/**
	 * The handler for incoming requests
	 * @param request The request
	 * @param response The response
	 */
	public handler(request: IncomingMessage, response: ServerResponse): Promise<void>;

	/**
	 * The handler for errors
	 * @param error The error
	 * @param request The request
	 * @param response The response
	 */
	public onError(error: Error | ErrorLike, request: KlasaIncomingMessage, response: ServerResponse): void;
}

export type ErrorLike = {
	code?: number;
	status?: number;
	statusCode?: number;
	message?: string;
};

export type KlasaIncomingMessage = {
	/**
	 * The original URL
	 */
	originalUrl: string;

	/**
	 * The entire path section of the URL, including the `host`, `port`... and before the `query`/`hash` components
	 */
	path: string;

	/**
	 * The entire query string portion of the URL including the leading ASCII question mark (`?`) character
	 */
	search: string;

	/**
	 * The collection of key and value pairs parsed from the query string portion
	 */
	query: { [k: string]: any };
} & IncomingMessage;
