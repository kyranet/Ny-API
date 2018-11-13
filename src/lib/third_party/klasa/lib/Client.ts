// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { EventEmitter } from 'events';
import { dirname } from 'path';
import { Collection } from '../../collection/lib/Collection';
import { ConstructorType } from '../../klasa-dashboard-hooks/lib/util/Util';
import { Piece, PieceOptions } from './structures/base/Piece';
import { Store } from './structures/base/Store';
import { KlasaConsole, KlasaConsoleOptions } from './util/KlasaConsole';

export type ClientOptions = {
	pieceDefaults?: Record<string, PieceOptions>;
	console?: KlasaConsoleOptions;
};

export class Client extends EventEmitter {
	// tslint:disable-next-line no-any
	public options: Required<ClientOptions>;
	public userBaseDirectory = dirname(require.main.filename);
	public console: KlasaConsole;
	public pieceStores: Collection<string, Store<string, Piece, new (...args: any[]) => Piece>> = new Collection();

	public constructor(options: ClientOptions = {}) {
		super();
		this.options = <Required<ClientOptions>> options;
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
}
