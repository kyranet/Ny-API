// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { ServerResponse } from 'http';
import { Store } from '../../../klasa/lib/structures/base/Store';
import { DashboardClient } from '../DashboardClient';
import { KlasaIncomingMessage } from '../http/Server';
import { ConstructorType } from '../util/Util';
import { Middleware } from './Middleware';
import { Route } from './Route';

export class MiddlewareStore extends Store<string, Middleware, ConstructorType<Middleware>> {

	/**
	 * The middlewares sorted by priority
	 */
	public sortedMiddlewares: Middleware[] = [];

	public constructor(client: DashboardClient) {
		super(client, 'middlewares', Middleware as ConstructorType<Middleware>);
	}

	/**
	 * Clears the RouteStore
	 */
	public clear(): void {
		this.sortedMiddlewares = [];
		return super.clear();
	}

	/**
	 * Adds a Middleware to this MiddlewareStore
	 * @param piece The Middleware to add to this store
	 */
	public set(piece: Middleware): Middleware {
		const middleware = super.set(piece);
		if (!middleware) return middleware;
		const index = this.sortedMiddlewares.findIndex((mid) => mid.priority >= middleware.priority);
		this.sortedMiddlewares.splice(index === -1 ? 0 : index, 0, middleware);
		return middleware;
	}

	/**
	 * Deletes a Middleware from this MiddlewareStore
	 * @param name The name of the Middleware or the Middleware
	 */
	public delete(name: Middleware | string): boolean {
		const middleware = this.resolve(name);
		if (!middleware) return false;
		this.sortedMiddlewares.splice(this.sortedMiddlewares.indexOf(middleware), 1);
		return super.delete(middleware);
	}

	/**
	 * Runs all the middleware.
	 * @since 0.0.1
	 * @param request The http request
	 * @param response The http response
	 * @param route The route being run
	 */
	public async run(request: KlasaIncomingMessage, response: ServerResponse, route: Route): Promise<void> {
		for (const middleware of this.sortedMiddlewares) {
			if (response.finished) return;
			if (middleware.enabled) await middleware.run(request, response, route);
		}
	}

}
