// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { ServerResponse } from 'http';
import { Piece, PieceOptions } from '../../../klasa/lib/structures/base/Piece';
import { DashboardClient } from '../DashboardClient';
import { KlasaIncomingMessage } from '../http/Server';
import { MiddlewareStore } from './MiddlewareStore';
import { Route } from './Route';

/**
 * The middleware options
 */
export type MiddlewareOptions = {
	priority?: number;
} & PieceOptions;

export abstract class Middleware extends Piece {

	/**
	 * The priority in which this middleware should run
	 */
	public priority: number;

	public constructor(client: DashboardClient, store: MiddlewareStore, file: string[], directory: string, options: MiddlewareOptions = {}) {
		super(client, store, file, directory, options);
		this.priority = options.priority;
	}

	public abstract async run(request: KlasaIncomingMessage, response: ServerResponse, route: Route): Promise<void>;

}
