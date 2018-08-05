import { Route } from "./Route";
import { APIClient } from "../../../../../../..";

export class RouteStore extends Map<string, Route> {
	public constructor(client: APIClient);

	/**
	 * The Client that manages this instance
	 */
	public client: APIClient;

	/**
	 * A lookup registry of Maps keyed on http method
	 */
	public registry: { [k in HttpMethods]: Map<string, Route> };

	/**
	 * Finds a route using the registry
	 * @param method The http method
	 * @param splitUrl The url to find
	 */
	public findRoute(method: string, splitUrl: string[]): Route;

	/**
	 * Adds a Route to this RouteStore
	 * @param route The route to add to this store
	 */
	public set(route: Route): Route;

	/**
	 * Deletes a Route from this RouteStore
	 * @param route The name of the Route or the Route to delete
	 */
	public delete(route: Route | string): boolean;
}

export enum HttpMethods {
	ACL,
	BIND,
	CHECKOUT,
	CONNECT,
	COPY,
	DELETE,
	GET,
	HEAD,
	LINK,
	LOCK,
	'M-SEARCH',
	MERGE,
	MKACTIVITY,
	MKCALENDAR,
	MKCOL,
	MOVE,
	NOTIFY,
	OPTIONS,
	PATCH,
	POST,
	PROPFIND,
	PROPPATCH,
	PURGE,
	PUT,
	REBIND,
	REPORT,
	SEARCH,
	SOURCE,
	SUBSCRIBE,
	TRACE,
	UNBIND,
	UNLINK,
	UNLOCK,
	UNSUBSCRIBE
};
