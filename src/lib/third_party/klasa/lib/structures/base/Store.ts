// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { ensureDir, scan } from 'fs-nextra';
import { extname, join, relative, sep } from 'path';
import { Collection } from '../../../../collection/lib/Collection';
import { ConstructorType } from '../../../../klasa-dashboard-hooks/lib/util/Util';
import { Client } from '../../Client';
import { isClass } from '../../util/util';
import { Piece } from './Piece';

// @ts-ignore
export class Store<K, V extends Piece, C extends ConstructorType<V>> extends Collection<K, V> {

	/**
	 * The directory of local pieces relative to where you run Klasa from.
	 */
	public get userDirectory(): string {
		return join(this.client.userBaseDirectory, this.name);
	}

	/**
	 * The client this Store was created with
	 */
	public client: Client;

	/**
	 * The name of what this holds
	 */
	public name: string;

	/**
	 * The type of structure this store holds
	 */
	public holds: C;

	/**
	 * The core directories pieces of this store can hold
	 */
	public coreDirectories: Set<string> = new Set();

	public constructor(client: Client, name: string, holds: C) {
		super();
		this.client = client;
		this.name = name;
		this.holds = holds;
	}

	/**
	 * Initializes all pieces in this store.
	 */
	public init(): Promise<Array<any>> {
		// @ts-ignore
		return Promise.all(this.map(piece => piece.enabled ? piece.init() : piece.unload()));
	}

	/**
	 * Loads a piece into Klasa so it can be saved in this store.
	 * @since 0.0.1
	 * @param directory The directory the file is located in
	 * @param file A string or array of strings showing where the file is located.
	 */
	public load(directory: string, file: string[]): Piece {
		const loc = join(directory, ...file);
		let piece: V | null = null;
		try {
			const KlasaPiece = (req => req.default || req)(require(loc));
			if (!isClass(KlasaPiece)) throw new TypeError('The exported structure is not a class.');
			piece = this.set(new KlasaPiece(this, file, directory));
		} catch (error) {
			this.client.console.wtf(`Failed to load file '${loc}'. Error:\n${error.stack || error}`);
		}

		// tslint:disable-next-line no-dynamic-delete
		delete require.cache[loc];
		module.children.pop();
		return piece!;
	}

	/**
	 * Loads all of our Pieces from both the user and core directories.
	 */
	public async loadAll(): Promise<number> {
		this.clear();
		for (const directory of this.coreDirectories) await Store.walk(this, directory);
		await Store.walk(this);
		return this.size;
	}

	/**
	 * Sets up a piece in our store.
	 * @param piece The piece we are setting up
	 */
	// @ts-ignore
	public set(piece: V): V | null {
		if (!(piece instanceof this.holds)) {
			this.client.console.error(`Only ${this} may be stored in this Store.`);
			return null;
		}
		const existing = this.get(piece.name as unknown as K);
		if (existing) this.delete(existing);
		else this.client.emit('pieceLoaded', piece);
		super.set(piece.name as unknown as K, piece);
		return piece;
	}

	/**
	 * Deletes a command from the store.
	 * @param name A command object or a string representing a command or alias name
	 */
	// @ts-ignore
	public delete(name: V | K): boolean {
		const piece = this.resolve(name);
		if (!piece) return false;
		super.delete(piece.name as unknown as K);
		return true;
	}

	/**
	 * Resolve a string or piece into a piece object.
	 */
	public resolve(name: V | K): V {
		if (name instanceof this.holds) return name as V;
		return this.get(name as K)!;
	}

	/**
	 * Defines toString behavior for stores
	 */
	public toString(): string {
		return this.name;
	}

	/**
	 * Registers a core directory to check for pieces
	 */
	protected registerCoreDirectory(directory: string): this {
		this.coreDirectories.add(directory + this.name);
		return this;
	}

	/**
	 * Walks our directory of Pieces for the user and core directories.
	 * @param store The store we're loading into
	 * @param directory The directory to walk in
	 */
	public static async walk<K, V extends Piece, C extends new(...args: any[]) => V>(store: Store<K, V, C>, directory: string = store.userDirectory): Promise<Array<Piece>> {
		try {
			const files = await scan(directory, { filter: (stats, path) => stats.isFile() && extname(path) === '.js' });
			return Promise.all([...files.keys()].map(file => store.load(directory, relative(directory, file).split(sep))));
		} catch (error) {
			await ensureDir(directory);
			store.client.console.error(error);
			return [];
		}
	}

}
