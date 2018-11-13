// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { Console } from 'console';
import { Writable } from 'stream';
import { inspect } from 'util';
import { Colors, ColorsFormatOptions } from './Colors';
import { CONSOLE } from './constants';
import { Timestamp } from './Timestamp';
import { mergeDefault } from './util';

/**
 * Klasa's console class, extends NodeJS Console class.
 */
export class KlasaConsole extends Console {

	/**
	 * The standard output stream for this console, defaulted to process.stdout.
	 */
	public readonly stdout: Writable;

	/**
	 * The standard error output stream for this console, defaulted to process.stderr
	 */
	public readonly stderr: Writable;

	/**
	 * The Timestamp instance to display the dates
	 */
	public readonly template: Timestamp | null;

	/**
	 * The colors for this console
	 */
	public readonly colors: Record<KlasaConsoleTypes, KlasaConsoleColor>;

	/**
	 * Whether the timestamp should be in utc or not
	 */
	public readonly utc: boolean;

	public constructor(options: KlasaConsoleOptions = {}) {
		mergeDefault(CONSOLE, options);
		super(options.stdout, options.stderr);

		this.stdout = options.stdout;
		this.stderr = options.stderr;
		this.template = options.timestamps !== false ? new Timestamp(options.timestamps === true ? 'YYYY-MM-DD HH:mm:ss' : options.timestamps) : null;
		this.utc = options.utc;

		this.colors = {} as Record<KlasaConsoleTypes, KlasaConsoleColor>;
		for (const [name, formats] of Object.entries(options.colors)) {
			this.colors[name] = {};
			for (const [type, format] of Object.entries(formats)) this.colors[name][type] = new Colors(format);
		}
	}

	/**
	 * Calls a log write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public log(...data: any[]): void {
		this.write(data, 'log');
	}

	/**
	 * Calls a warn write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public warn(...data: any[]): void {
		this.write(data, 'warn');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public error(...data: any[]): void {
		this.write(data, 'error');
	}

	/**
	 * Calls a debug write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public debug(...data: any[]): void {
		this.write(data, 'debug');
	}

	/**
	 * Calls a verbose write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public verbose(...data: any[]): void {
		this.write(data, 'verbose');
	}

	/**
	 * Calls a wtf (what a terrible failure) write with everything to the console/writable stream.
	 * @param data The data we want to print
	 */
	public wtf(...data: any[]): void {
		this.write(data, 'wtf');
	}

	/**
	 * The timestamp to use
	 */
	private get timestamp(): string {
		return this.utc ? this.template.displayUTC() : this.template.display();
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @param data The data we want to print
	 * @param type The type of log, particularly useful for coloring
	 */
	private write(data: any[], type: KlasaConsoleTypes = 'log'): void {
		const flattened = data.map(KlasaConsole._flatten).join('\n');
		const { time, message } = this.colors[type];
		const timestamp = this.template ? time.format(`[${this.timestamp}]`) : '';
		super[CONSOLE.types[type]](flattened.split('\n').map((str) => `${timestamp} ${message.format(str)}`).join('\n'));
	}

	/**
	 * Flattens our data into a readable string.
	 * @param data Some data to flatten
	 */
	private static _flatten(data: any): string {
		if (typeof data === 'undefined' || typeof data === 'number' || data === null) return String(data);
		if (typeof data === 'string') return data;
		if (typeof data === 'object') {
			const isArray = Array.isArray(data);
			if (isArray && data.every((datum) => typeof datum === 'string')) return data.join('\n');
			return data.stack || data.message || inspect(data, { depth: Number(isArray), colors: true });
		}
		return String(data);
	}

}

export type KlasaConsoleTypes = 'debug' | 'error' | 'log' | 'verbose' | 'warn' | 'wtf';

export type KlasaConsoleOptions = {
	/**
	 * The console color styles
	 */
	colors?: KlasaConsoleColorStyles<KlasaConsoleTypes>;
	/**
	 * The WritableStream for the output logs
	 */
	stdout?: Writable;
	/**
	 * The WritableStream for the error logs
	 */
	stderr?: Writable;
	/**
	 * If false, it won't use timestamps. Otherwise it will use 'YYYY-MM-DD HH:mm:ss' if true or custom if string is given
	 */
	timestamps?: boolean | string;
	/**
	 * The types for each color
	 */
	types?: Record<KlasaConsoleTypes, ConsoleTypes>;
	/**
	 * Whether the timestamps should be in utc or not
	 */
	utc?: boolean;
};

export type KlasaConsoleColorStyles<T extends string> = Record<T, KlasaConsoleColorStyle>;

export type KlasaConsoleColorStyle = {
	message?: ColorsFormatOptions;
	time?: ColorsFormatOptions;
	shard?: ColorsFormatOptions;
};

type KlasaConsoleColor = {
	time: Colors;
	shard: Colors;
	message: Colors;
};

type ConsoleTypes = 'log' | 'debug' | 'info' | 'warn' | 'error';
