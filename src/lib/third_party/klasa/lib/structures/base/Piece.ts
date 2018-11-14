// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { join } from 'path';
import { ConstructorType } from '../../../../klasa-dashboard-hooks/lib/util/Util';
import { Client } from '../../Client';
import { mergeDefault } from '../../util/util';
import { Store } from './Store';

export class Piece {

	/**
	 * The client this Piece was created with
	 */
	public client: Client;

	/**
	 * The store this piece is for
	 */
	public store: Store<string, Piece, ConstructorType<Piece>>;

	/**
	 * The path from the pieces folder to the file
	 */
	public file: string[];

	/**
	 * The base directory to the pieces folder
	 */
	public directory: string;

	/**
	 * The options for this piece
	 */
	public options: Required<PieceOptions>;

	/**
	 * The name of the Piece
	 */
	public name: string;

	/**
	 * If the Piece is enabled or not
	 */
	public enabled: boolean;

	public constructor(client: Client, store: Store<string, Piece, ConstructorType<Piece>>, file: string[], directory: string, options: PieceOptions = {}) {
		const defaults = client.options.pieceDefaults[store.name];
		if (defaults) options = mergeDefault(defaults, options);

		this.client = client;
		this.file = file;
		this.name = options.name || file[file.length - 1].slice(0, -3);
		this.enabled = options.enabled;
		this.store = store;
		this.directory = directory;
	}

	/**
	 * The type of Klasa piece this is
	 */
	public get type(): string {
		return this.store.name.slice(0, -1);
	}

	/**
	 * The absolute path to this piece
	 */
	public get path(): string {
		return join(this.directory, ...this.file);
	}

	/**
	 * Reloads this piece
	 */
	public async reload(): Promise<Piece> {
		const piece = this.store.load(this.directory, this.file);
		await piece.init();
		this.client.emit('pieceReloaded', piece);
		return piece;
	}

	/**
	 * Unloads this piece
	 */
	public unload(): boolean {
		this.client.emit('pieceUnloaded', this);
		return this.store.delete(this);
	}

	/**
	 * Disables this piece
	 * @chainable
	 */
	public disable(): this {
		this.client.emit('pieceDisabled', this);
		this.enabled = false;
		return this;
	}

	/**
	 * Enables this piece
	 * @chainable
	 */
	public enable(): this {
		this.client.emit('pieceEnabled', this);
		this.enabled = true;
		return this;
	}

	/**
	 * The init method to be optionally overwritten in actual commands
	 */
	public async init(): Promise<void> {
		// noop
	}

	/**
	 * Defines toString behavior for pieces
	 */
	public toString(): string {
		return this.name;
	}

	/**
	 * Defines the JSON.stringify behavior of this task.
	 */
	public toJSON(): PieceToJSON<Required<PieceOptions>> {
		return {
			directory: this.directory,
			enabled: this.enabled,
			file: this.file,
			name: this.name,
			path: this.path,
			type: this.type
		};
	}

}

export type PieceOptions = {
	/**
	 * The name of the piece
	 */
	name?: string;
	/**
	 * Whether the piece is enabled or not
	 */
	enabled?: boolean;
};

export type PieceToJSON<T extends Required<PieceOptions>> = T & {
	/**
	 * The base directory to the pieces folder
	 */
	directory: string;
	/**
	 * The path from the pieces folder to the file
	 */
	file: string[];
	/**
	 * The absolute path to this piece
	 */
	path: string;
	/**
	 * The type of Klasa piece this is
	 */
	type: string;
};
