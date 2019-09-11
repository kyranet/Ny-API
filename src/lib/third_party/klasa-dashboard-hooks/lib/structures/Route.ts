// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { Piece, PieceOptions } from '../../../klasa/lib/structures/base/Piece';
import { DashboardClient } from '../DashboardClient';
import { parse, ParsedPart } from '../util/Util';
import { RouteStore } from './RouteStore';

/**
 * The parsed route pieces
 */
export type ParsedRoute = ParsedPart[];
/**
 * The route options
 */
export type RouteOptions = {
	route?: string;
	authenticated?: boolean;
} & PieceOptions;

export class Route extends Piece {

	public client!: DashboardClient;

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

	public constructor(store: RouteStore, file: string[], directory: string, options: RouteOptions = {}) {
		super(store, file, directory, options);
		this.route = `${this.client.options.dashboardHooks.apiPrefix}${options.route}`;
		this.authenticated = options.authenticated!;
		this.parsed = parse(this.route);
	}

	/**
	 * If this route matches a provided url
	 * @param split the url to check
	 */
	public matches(split: string[]) {
		if (split.length !== this.parsed.length) return false;
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 0 && this.parsed[i].val !== split[i]) return false;
		return true;
	}

	/**
	 * Extracts the params from a provided url
	 * @param split the url
	 */
	public execute(split: string[]) {
		const params = {} as Record<string, unknown>;
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 1) params[this.parsed[i].val] = split[i];
		return params;
	}

}
