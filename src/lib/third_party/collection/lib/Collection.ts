// Copyright (c) 2015-2018 Amish Shah. All rights reserved. Apache License 2.0 license.
export class Collection<K, V> extends Map<K, V> {

	/**
	 * Cached array for the `array()` method - will be reset to `null` whenever
	 * `set()` or `delete()` are called
	 */
	private _array: V[] = null;

	/**
	 * Cached array for the `keyArray()` method - will be reset to `null`
	 * whenever `set()` or `delete()` are called
	 */
	private _keyArray: K[] = null;

	public set(key: K, val: V): this {
		this._array = null;
		this._keyArray = null;
		return super.set(key, val);
	}

	public delete(key: K): boolean {
		this._array = null;
		this._keyArray = null;
		return super.delete(key);
	}

	/**
	 * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
	 * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
	 * itself. If you don't want this caching behavior, use `[...collection.values()]` or
	 * `Array.from(collection.values())` instead.
	 */
	public array(): V[] {
		if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
		return this._array;
	}

	/**
	 * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
	 * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
	 * itself. If you don't want this caching behavior, use `[...collection.keys()]` or
	 * `Array.from(collection.keys())` instead.
	 */
	public keyArray(): K[] {
		if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
		return this._keyArray;
	}

	/**
	 * Obtains the first value(s) in this collection.
	 * @param amount Amount of values to obtain from the beginning
	 * @returns A single value if no amount is provided or an array of values, starting from the end if
	 * amount is negative
	 */
	public first(amount: 0): [];
	public first(amount?: 1): V;
	public first(amount: number): V[];
	public first(amount?: number): V | V[] {
		if (typeof amount === 'undefined') return this.values().next().value;
		if (amount < 0) return this.last(amount * -1);
		amount = Math.min(this.size, amount);
		const arr = new Array(amount);
		const iter = this.values();
		for (let i = 0; i < amount; i++) arr[i] = iter.next().value;
		return arr;
	}

	/**
	 * Obtains the first key(s) in this collection.
	 * @param amount Amount of keys to obtain from the beginning
	 * @returns A single key if no amount is provided or an array of keys, starting from the end if
	 * amount is negative
	 */
	public firstKey(amount: 0): [];
	public firstKey(amount?: 1): K;
	public firstKey(amount: number): K[];
	public firstKey(amount?: number): K | K[] {
		if (typeof amount === 'undefined') return this.keys().next().value;
		if (amount < 0) return this.lastKey(amount * -1);
		amount = Math.min(this.size, amount);
		const arr = new Array(amount);
		const iter = this.keys();
		for (let i = 0; i < amount; i++) arr[i] = iter.next().value;
		return arr;
	}

	/**
	 * Obtains the last value(s) in this collection. This relies on {@link Collection#array}, and thus the caching
	 * mechanism applies here as well.
	 * @param amount Amount of values to obtain from the end
	 * @returns A single value if no amount is provided or an array of values, starting from the start if
	 * amount is negative
	 */
	public last(amount: 0): [];
	public last(amount?: 1): V;
	public last(amount: number): V[];
	public last(amount?: number): V | V[] {
		const arr = this.array();
		if (typeof amount === 'undefined') return arr[arr.length - 1];
		if (amount < 0) return this.first(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Obtains the last key(s) in this collection. This relies on {@link Collection#keyArray}, and thus the caching
	 * mechanism applies here as well.
	 * @param amount Amount of keys to obtain from the end
	 * @returns A single key if no amount is provided or an array of keys, starting from the start if
	 * amount is negative
	 */
	public lastKey(amount: 0): [];
	public lastKey(amount?: 1): K;
	public lastKey(amount: number): K[];
	public lastKey(amount?: number): K | K[] {
		const arr = this.keyArray();
		if (typeof amount === 'undefined') return arr[arr.length - 1];
		if (amount < 0) return this.firstKey(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Obtains unique random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
	 * mechanism applies here as well.
	 * @param amount Amount of values to obtain randomly
	 * @returns A single value if no amount is provided or an array of values
	 */
	public random(amount: 0): [];
	public random(amount?: 1): V;
	public random(amount: number): V[];
	public random(amount?: number): V | V[] {
		let arr = this.array();
		if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
		if (arr.length === 0 || !amount) return [];
		const rand = new Array(amount);
		arr = arr.slice();
		for (let i = 0; i < amount; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
		return rand;
	}

	/**
	 * Obtains unique random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
	 * mechanism applies here as well.
	 * @param amount Amount of keys to obtain randomly
	 * @returns A single key if no amount is provided or an array
	 */
	public randomKey(amount: 0): [];
	public randomKey(amount?: 1): K;
	public randomKey(amount: number): K[];
	public randomKey(amount?: number): K | K[] {
		let arr = this.keyArray();
		if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
		if (arr.length === 0 || !amount) return [];
		const rand = new Array(amount);
		arr = arr.slice();
		for (let i = 0; i < amount; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
		return rand;
	}

	/**
	 * Searches for a single item where the given function returns a truthy value. This behaves like
	 * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
	 * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
	 * should use the `get` method. See
	 * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
	 * @param fn The function to test with (should return boolean)
	 * @param thisArg Value to use as `this` when executing function
	 * @example collection.find(user => user.username === 'Bob');
	 */
	public find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): V | undefined {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return val;
		}
		return undefined;
	}

	/* eslint-disable max-len */
	/**
	 * Searches for the key of a single item where the given function returns a truthy value. This behaves like
	 * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex),
	 * but returns the key rather than the positional index.
	 * @param fn The function to test with (should return boolean)
	 * @param thisArg Value to use as `this` when executing function
	 * @example collection.findKey(user => user.username === 'Bob');
	 */
	public findKey(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): K | undefined {
		/* eslint-enable max-len */
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return key;
		}
		return undefined;
	}

	/**
	 * Removes entries that satisfy the provided filter function.
	 * @param fn Function used to test (should return a boolean)
	 * @param thisArg Value to use as `this` when executing function
	 */
	public sweep(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): number {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const previousSize = this.size;
		for (const [key, val] of this) {
			if (fn(val, key, this)) this.delete(key);
		}
		return previousSize - this.size;
	}

	/**
	 * Identical to
	 * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
	 * but returns a Collection instead of an Array.
	 * @param fn The function to test with (should return boolean)
	 * @param thisArg Value to use as `this` when executing function
	 * @example collection.filter(user => user.username === 'Bob');
	 */
	public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): Collection<K, V> {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = new this.constructor[Symbol.species]();
		for (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}
		return results;
	}

	/**
	 * Partitions the collection into two collections where the first collection
	 * contains the items that passed and the second contains the items that failed.
	 * @param fn Function used to test (should return a boolean)
	 * @param thisArg Value to use as `this` when executing function
	 * @example const [big, small] = collection.partition(guild => guild.memberCount > 250);
	 */
	public partition(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): [Collection<K, V>, Collection<K, V>] {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = [new this.constructor[Symbol.species](), new this.constructor[Symbol.species]()] as [Collection<K, V>, Collection<K, V>];
		for (const [key, val] of this) {
			if (fn(val, key, this)) {
				results[0].set(key, val);
			} else {
				results[1].set(key, val);
			}
		}
		return results;
	}

	/**
	 * Maps each item to another value. Identical in behavior to
	 * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
	 * @param fn Function that produces an element of the new array, taking three arguments
	 * @param thisArg Value to use as `this` when executing function
	 * @example collection.map(user => user.tag);
	 */
	public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: any): T[] {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const arr = new Array(this.size);
		let i = 0;
		for (const [key, val] of this) arr[i++] = fn(val, key, this);
		return arr;
	}

	/**
	 * Checks if there exists an item that passes a test. Identical in behavior to
	 * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
	 * @param fn Function used to test (should return a boolean)
	 * @param thisArg Value to use as `this` when executing function
	 * @example collection.some(user => user.discriminator === '0000');
	 */
	public some(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): boolean {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return true;
		}
		return false;
	}

	/**
	 * Checks if all items passes a test. Identical in behavior to
	 * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
	 * @param fn Function used to test (should return a boolean)
	 * @param thisArg Value to use as `this` when executing function
	 * @example collection.every(user => !user.bot);
	 */
	public every(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): boolean {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (!fn(val, key, this)) return false;
		}
		return true;
	}

	/**
	 * Applies a function to produce a single value. Identical in behavior to
	 * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
	 * @param fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
	 * and `collection`
	 * @param initialValue Starting value for the accumulator
	 * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
	 */
	public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue: T): T {
		let accumulator;
		if (typeof initialValue !== 'undefined') {
			accumulator = initialValue;
			for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
		} else {
			let first = true;
			for (const [key, val] of this) {
				if (first) {
					accumulator = val;
					first = false;
					continue;
				}
				accumulator = fn(accumulator, val, key, this);
			}
		}
		return accumulator;
	}

	/**
	 * Identical to
	 * [Map.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach),
	 * but returns the collection instead of undefined.
	 * @param fn Function to execute for each element
	 * @param thisArg Value to use as `this` when executing function
	 * @example
	 * collection
	 *  .each(user => console.log(user.username))
	 *  .filter(user => user.bot)
	 *  .each(user => console.log(user.username));
	 */
	public each(fn: (value: V, key: K, collection: this) => boolean, thisArg?: any): this {
		this.forEach(fn, thisArg);
		return this;
	}

	/**
	 * Runs a function on the collection and returns the collection.
	 * @param fn Function to execute
	 * @param thisArg Value to use as `this` when executing function
	 * @example
	 * collection
	 *  .tap(coll => coll.size)
	 *  .filter(user => user.bot)
	 *  .tap(coll => coll.size)
	 */
	public tap(fn: (collection: this) => boolean, thisArg?: any): this {
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		fn(this);
		return this;
	}

	/**
	 * Creates an identical shallow copy of this collection.
	 * @example const newColl = someColl.clone();
	 */
	public clone(): Collection<K, V> {
		return new this.constructor[Symbol.species](this) as Collection<K, V>;
	}

	/**
	 * Combines this collection with others into a new collection. None of the source collections are modified.
	 * @param collections Collections to merge
	 * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
	 */
	public concat(...collections: Array<Collection<K, V>>): Collection<K, V> {
		const newColl = this.clone();
		for (const coll of collections) {
			for (const [key, val] of coll) newColl.set(key, val);
		}
		return newColl;
	}

	/**
	 * Checks if this collection shares identical key-value pairings with another.
	 * This is different to checking for equality using equal-signs, because
	 * the collections may be different objects, but contain the same data.
	 * @param collection Collection to compare with
	 */
	public equals(collection: Collection<K, V>): boolean {
		if (!collection) return false;
		if (this === collection) return true;
		if (this.size !== collection.size) return false;
		return !this.find((value, key) => {
			const testVal = collection.get(key);
			return testVal !== value || (testVal === undefined && !collection.has(key));
		});
	}

	/**
	 * The sort() method sorts the elements of a collection and returns it.
	 * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
	 * @param compareFunction Specifies a function that defines the sort order.
	 * If omitted, the collection is sorted according to each character's Unicode code point value,
	 * according to the string conversion of each element.
	 * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 */
	public sort(compareFunction: (vx: V, vy: V, kx: K, ky: K) => number = (x: V, y: V) => +(x > y) || +(x === y) - 1): Collection<K, V> {
		return new this.constructor[Symbol.species]([...this.entries()]
			.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0])));
	}

}
