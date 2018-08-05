import { RouteStore } from "./RouteStore";
import { APIClient } from "../../../../../../..";

/**
 * Base class for all Klasa Routes.
 */
export class Route {
	public constructor(store: RouteStore, options?: RouteOptions);

	/**
	 * The Client that manages this instance
	 */
	public client: APIClient;

	/**
	 * The store that manages this instance
	 */
	public store: RouteStore;

	/**
	 * The name of this piece
	 */
	public name: string;

	/**
	 * Stored bound run method, so it can be properly disabled and reloaded later
	 */
	public route: string;

	/**
	 * If the route is authenticated
	 */
	public authenticated: boolean;

	/**
	 * Stored parsed route
	 */
	public parsed: ParsedRoute;

	/**
	 * If this route matches a provided url
	 * @param split The url to check
	 */
	public matches(split: string[]): boolean;

	/**
	 * Extracts the params from a provided url
	 * @param split The url
	 */
	public execute<T extends { [k: string]: any }>(split: string[]): T;
}

export type ParsedRoute = ParsedPart[];

export type ParsedPart = {
	val: string;
	type: number;
};

export type RouteOptions = {
	name?: string;
	route?: string;
	authenticated?: boolean;
};
