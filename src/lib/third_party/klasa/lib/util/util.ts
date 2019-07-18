// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
export function isClass(input: any): boolean {
	return typeof input === 'function'
		&& typeof input.prototype === 'object'
		&& input.toString().substring(0, 5) === 'class';
}

export function isObject(input: any): boolean {
	return input && input.constructor === Object;
}

export const PRIMITIVE_TYPES = ['string', 'bigint', 'number', 'boolean'];

export function isPrimitive(value: any): boolean {
	return PRIMITIVE_TYPES.includes(typeof value);
}

export function mergeDefault<T = Record<string, any>, S = Record<string, any>>(def: T, given?: S): T & S {
	if (!given) return deepClone(given as T & S);
	const keys = Object.keys(def);
	if (!keys.length) return deepClone(given as T & S);

	for (const key of Object.keys(def)) {
		const value = (given as T & S)[key];
		if (typeof value === 'undefined') (given as T & S)[key] = deepClone((given as T & S)[key]);
		else if (isObject(value)) mergeDefault(def[key], value);
	}

	return given as T & S;
}

export function deepClone<T>(source: T): T {
	// Check if it's a primitive (with exception of function and null, which is typeof object)
	if (source === null || isPrimitive(source)) return source;
	if (Array.isArray(source)) {
		const output: T[] = [];
		for (const value of source) output.push(deepClone(value));
		// @ts-ignore
		return output;
	}
	if (isObject(source)) {
		const output = {};
		for (const [key, value] of Object.entries(source)) output[key] = deepClone(value);
		// @ts-ignore
		return output;
	}
	if (source instanceof Map) {
		// @ts-ignore
		const output = new source.constructor();
		for (const [key, value] of source.entries()) output.set(key, deepClone(value));
		return output;
	}
	if (source instanceof Set) {
		// @ts-ignore
		const output = new source.constructor();
		for (const value of source.values()) output.add(deepClone(value));
		return output;
	}
	return source;
}
