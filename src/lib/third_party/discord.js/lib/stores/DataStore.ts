// Copyright (c) 2015-2018 Amish Shah. All rights reserved. Apache License 2.0 license.
import { Collection } from './Collection';
import { Client } from '../../../klasa';
import { CollectionConstructor } from '@discordjs/collection';

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 */
export class DataStore<K extends string, V extends { id: K }, C extends new (...args: unknown[]) => V> extends Collection<K, V> {

	public client: Client;
	public holds: C;
	public constructor(client: Client, iterable: Iterable<V>, holds: C) {
		super();
		this.client = client;
		this.holds = holds;
		if (iterable) for (const item of iterable) this.add(item);
	}

	public add(data: V, cache: boolean = true) {
		const existing = this.get(data.id);
		if (existing) return existing;

		const entry = this.holds ? new this.holds(this.client, data) : data;
		if (cache) this.set(entry.id, entry);
		return entry;
	}

	public remove(key: K) { return this.delete(key); }

	/**
	 * Resolves a data entry to a data Object.
	 * @param idOrInstance The id or instance of something in this DataStore
	 */
	public resolve(idOrInstance: K | V) {
		if (idOrInstance instanceof this.holds) return idOrInstance as V;
		if (typeof idOrInstance === 'string') return this.get(idOrInstance) || null;
		return null;
	}

	/**
	 * Resolves a data entry to a instance ID.
	 * @param idOrInstance The id or instance of something in this DataStore
	 */
	public resolveID(idOrInstance: K | V) {
		if (idOrInstance instanceof this.holds) return (idOrInstance as V).id;
		if (typeof idOrInstance === 'string') return idOrInstance;
		return null;
	}

	public static get [Symbol.species]() {
		return Collection as unknown as CollectionConstructor;
	}

}
