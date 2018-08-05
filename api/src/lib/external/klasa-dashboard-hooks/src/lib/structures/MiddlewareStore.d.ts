import { Middleware } from "./Middleware";
import { APIClient } from "../../../../../../..";
import { KlasaIncomingMessage } from "../http/Server";
import { ServerResponse } from "http";
import { Route } from "./Route";

/**
 * Stores all the middlewares that are part of Klasa-dashboard-hooks
 */
export class MiddlewareStore extends Map<string, Middleware> {
	public constructor(client: APIClient);

	/**
	 * The Client that manages this instance
	 */
	public client: APIClient;

	/**
	 * The middlewares sorted by priority
	 */
	public sortedMiddlewares: Middleware[];

	/**
	 * Adds a Middleware to this MiddlewareStore
	 * @param piece The Middleware to add to this store
	 */
	public set(piece: Middleware): Middleware;

	/**
	 * Deletes a Middleware from this MiddlewareStore
	 * @param name The name of the Middleware or the Middleware
	 */
	public delete(name: Middleware | string): boolean;

	/**
	 * Runs all the middleware
	 * @param request The request
	 * @param response The response
	 * @param route The route being run
	 */
	public run(request: KlasaIncomingMessage, response: ServerResponse, route: Route): Promise<void>;

	public resolve(middleware: Middleware | string): Middleware;
}
