// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { EventEmitter } from 'events';
import { dirname } from 'path';
import { Collection } from '../../collection/lib/Collection';
import { ConstructorType } from '../../klasa-dashboard-hooks/lib/util/Util';
import { Piece, PieceOptions } from './structures/base/Piece';
import { Store } from './structures/base/Store';
import { KlasaConsole, KlasaConsoleOptions } from './util/KlasaConsole';
import { Stopwatch } from './util/Stopwatch';

/**
 * The client options
 */
export interface ClientOptions {
	clientID?: string;
	clientSecret?: string;
	pieceDefaults?: Record<string, PieceOptions>;
	console?: KlasaConsoleOptions;
}

export class Client extends EventEmitter {

	public options: Required<ClientOptions>;
	public userBaseDirectory = dirname(require.main!.filename);
	public console: KlasaConsole;
	public pieceStores: Collection<string, Store<string, Piece, new (...args: any[]) => Piece>> = new Collection();

	public constructor(options: ClientOptions = {}) {
		super();
		this.options = options as Required<ClientOptions>;
		this.console = new KlasaConsole(options.console);
	}

	/**
	 * Registers a custom store to the client
	 * @param store The store that pieces will be stored in
	 * @chainable
	 */
	public registerStore<V extends Piece, C extends ConstructorType<V>>(store: Store<string, V, C>): this {
		this.pieceStores.set(store.name, store);
		return this;
	}

	/**
	 * Un-registers a custom store from the client
	 * @param storeName The store that pieces will be stored in
	 * @chainable
	 */
	public unregisterStore(storeName: string): this {
		this.pieceStores.delete(storeName);
		return this;
	}

	public async start(): Promise<void> {
		const timer = new Stopwatch();
		try {
			const loaded = await Promise.all(this.pieceStores.map(async store => `Loaded ${await store.loadAll()} ${store.name}.`));
			this.console.log(loaded.join('\n'));
			this.console.log(`Loaded in ${timer.stop()}.`);
		} catch (error) {
			this.console.error(error);
			process.exit();
		}
	}

}
