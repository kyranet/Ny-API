// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
export function isClass(input: unknown) {
	return typeof input === 'function'
		&& typeof input.prototype === 'object'
		&& input.toString().substring(0, 5) === 'class';
}

export function isObject(input: unknown) {
	return typeof input === 'object'
		&& input !== null
		&& input.constructor === Object;
}

export const PRIMITIVE_TYPES = ['string', 'bigint', 'number', 'boolean'];

export function isPrimitive(value: unknown) {
	return PRIMITIVE_TYPES.includes(typeof value);
}

export function mergeDefault<T = Record<string, unknown>, S = Record<string, unknown>>(def: T, given?: S) {
	if (!given) return deepClone(def as T & S);
	const keys = Object.keys(def);
	if (!keys.length) return deepClone(def as T & S);

	for (const [key, value] of Object.entries(def)) {
		const currentValue = (given as T & S)[key];
		if (typeof currentValue === 'undefined') (given as T & S)[key] = deepClone(value);
		else if (isObject(currentValue)) mergeDefault(value, currentValue);
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
