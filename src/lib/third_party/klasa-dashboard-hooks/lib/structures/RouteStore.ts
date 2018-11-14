// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { METHODS } from 'http';
import { Store } from '../../../klasa/lib/structures/base/Store';
import { DashboardClient } from '../DashboardClient';
import { METHODS_LOWER } from '../util/constants';
import { ConstructorType } from '../util/Util';
import { Route } from './Route';

export type RouteStoreRegistry = Record<keyof typeof HttpMethods, Map<string, Route>>;

export class RouteStore extends Store<string, Route, ConstructorType<Route>> {

	public registry: RouteStoreRegistry = {} as RouteStoreRegistry;

	public constructor(client: DashboardClient) {
		super(client, 'routes', Route);
		for (const method of METHODS) this.registry[method] = new Map();
	}

	/**
	 * Finds a route using the registry
	 * @param method The http method
	 * @param splitURL the url to find
	 */
	public findRoute(method: keyof typeof HttpMethods, splitURL: string[]): Route | undefined {
		for (const route of this.registry[method].values()) if (route.matches(splitURL)) return route;
		return undefined;
	}

	/**
	 * Clears the RouteStore
	 */
	public clear(): void {
		for (const method of METHODS) this.registry[method].clear();
		return super.clear();
	}

	/**
	 * Adds a Route to this RouteStore
	 * @param piece The route to add to this store
	 */
	public set(piece: Route): Route {
		const route = super.set(piece);
		if (!route) return route;
		for (const method of METHODS) if (METHODS_LOWER[method] in route) this.registry[method].set(route.name, route);
		return route;
	}

	/**
	 * Deletes a Route from this RouteStore
	 * @param name The name of the Route or the Route
	 */
	public delete(name: Route | string): boolean {
		const route = this.resolve(name);
		if (!route) return false;
		for (const method of METHODS) this.registry[method].delete(route.name);
		return super.delete(route);
	}

}

export enum HttpMethods {
	'ACL',
	'BIND',
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LINK',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCALENDAR',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REBIND',
	'REPORT',
	'SEARCH',
	'SOURCE',
	'SUBSCRIBE',
	'TRACE',
	'UNBIND',
	'UNLINK',
	'UNLOCK',
	'UNSUBSCRIBE'
}
