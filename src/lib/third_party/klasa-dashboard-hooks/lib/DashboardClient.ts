// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { SecureContextOptions } from 'tls';
import { DataStore } from '../../discord.js/lib/stores/DataStore';
import { Client } from '../../klasa';
import { ClientOptions } from '../../klasa/lib/Client';
import { mergeDefault } from '../../klasa/lib/util/util';
import { Server } from './http/Server';
import { DashboardUser } from './structures/DashboardUser';
import { MiddlewareStore } from './structures/MiddlewareStore';
import { RouteStore } from './structures/RouteStore';
import { OPTIONS } from './util/constants';

/**
 * The options for Klasa-Dashboard-Hooks
 */
export type KlasaDashboardHooksOptions = {
	/**
	 * The route prefix for the api
	 */
	apiPrefix?: string;
	/**
	 * The cross origin setting
	 */
	origin?: string;
	/**
	 * The port the api runs on
	 */
	port?: number;
	/**
	 * Whether the server should use http/2 or not
	 */
	http2?: boolean;
	/**
	 * The SSL options
	 */
	sslOptions?: SecureContextOptions;
};

/**
 * The DashboardClient options
 */
export type DashboardClientOptions = ClientOptions & {
	dashboardHooks?: KlasaDashboardHooksOptions;
};

// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
export class DashboardClient extends Client {

	public options: Required<DashboardClientOptions>;

	/**
	 * The http server handler for the api
	 */
	public server = new Server(this);

	/**
	 * The cache where routes are stored
	 */
	public routes = new RouteStore(this);

	/**
	 * The cache where middlewares are stored
	 */
	public middlewares = new MiddlewareStore(this);

	/**
	 * The cache where oauth data is temporarily stored
	 */
	public dashboardUsers = new DataStore(this, undefined, DashboardUser);

	public constructor(options?: DashboardClientOptions) {
		super(mergeDefault(OPTIONS, options));

		this
			.registerStore(this.routes)
			.registerStore(this.middlewares);

		this.server.listen(this.options.dashboardHooks.port)
			.catch((error) => { this.console.error(error); });
	}

}
