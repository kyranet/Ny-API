import { APIClient } from "../../../../../../..";
import { MiddlewareStore } from "./MiddlewareStore";
import { KlasaIncomingMessage } from "../http/Server";
import { ServerResponse } from "http";
import { Route } from "./Route";

/**
 * Base class for all Klasa Middleware.
 */
export class Middleware {
	public constructor(store: MiddlewareStore, options?: MiddlewareOptions);

	/**
	 * The Client that manages this instance
	 */
	public client: APIClient;

	/**
	 * The store that manages this instance
	 */
	public store: MiddlewareStore;

	/**
	 * The name of this middleware
	 */
	public name: string;

	/**
	 * The priority in which this middleware should run
	 */
	public priority: number;

	/**
	 * The run method to be overwritten in actual middleware handlers
	 * @param request The request
	 * @param response The response
	 * @param route The route being run
	 */
	public abstract run(request: KlasaIncomingMessage, response: ServerResponse, route: Route): Promise<void>;
}

export type MiddlewareOptions = {
	name: string;
	priority: number;
};
