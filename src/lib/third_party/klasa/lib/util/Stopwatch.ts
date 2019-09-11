// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { performance } from 'perf_hooks';

export class Stopwatch {

	/**
	 * The number of digits to appear after the decimal point when returning the friendly duration.
	 */
	public digits: number;

	/**
	 * The start time of this stopwatch
	 */
	private _start: number = performance.now();

	/**
	 * The end time of this stopwatch
	 */
	private _end: number | null = null;

	/**
	 * Starts a new Stopwatch
	 * @param digits The number of digits to appear after the decimal point when returning the friendly duration
	 */
	public constructor(digits: number = 2) {
		this.digits = digits;
	}

	/**
	 * The duration of this stopwatch since start or start to end if this stopwatch has stopped.
	 */
	public get duration() {
		return this._end ? this._end - this._start : performance.now() - this._start;
	}

	/**
	 * If the stopwatch is running or not
	 */
	public get running() {
		return Boolean(!this._end);
	}

	/**
	 * Restarts the Stopwatch (Returns a running state)
	 * @chainable
	 */
	public restart() {
		this._start = performance.now();
		this._end = null;
		return this;
	}

	/**
	 * Resets the Stopwatch to 0 duration (Returns a stopped state)
	 * @chainable
	 */
	public reset() {
		this._start = performance.now();
		this._end = this._start;
		return this;
	}

	/**
	 * Starts the Stopwatch
	 * @chainable
	 */
	public start() {
		if (!this.running) {
			this._start = performance.now() - this.duration;
			this._end = null;
		}
		return this;
	}

	/**
	 * Stops the Stopwatch, freezing the duration
	 * @chainable
	 */
	public stop() {
		if (this.running) this._end = performance.now();
		return this;
	}

	/**
	 * Defines toString behavior
	 */
	public toString() {
		const time = this.duration;
		if (time >= 1000) return `${(time / 1000).toFixed(this.digits)}s`;
		if (time >= 1) return `${time.toFixed(this.digits)}ms`;
		return `${(time * 1000).toFixed(this.digits)}μs`;
	}

}
