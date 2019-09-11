// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const [SLASH, COLON] = [47, 58];

/**
 * The parsed parts
 */
export interface ParsedPart {
	val: string;
	type: number;
}

export interface DecryptedAuth {
	token: string;
	scope: string[];
}

/**
 * Parses a url part
 * @param val The string part to parse
 */
export function parsePart(val: string) {
	const type = Number(val.charCodeAt(0) === COLON);
	if (type) val = val.substring(1);
	return { val, type } as ParsedPart;
}

/**
 * Splits a url into it's parts
 * @param url The url to split
 */
export function split(url: string) {
	if (url.length === 1 && url.charCodeAt(0) === SLASH) return [];
	else if (url.charCodeAt(0) === SLASH) url = url.substring(1);
	return url.split('/').filter(Boolean);
}

/**
 * Splits and parses a url into it's parts
 * @param url The url to split and parse
 */
export function parse(url: string) {
	return split(url).map(parsePart);
}

/**
 * Encrypts an object with aes-256-cbc to use as a token
 * @param data An object to encrypt
 * @param secret The secret to encrypt the data with
 */
export function encrypt(data: unknown, secret: string) {
	const iv = randomBytes(16);
	const cipher = createCipheriv('aes-256-cbc', secret, iv);
	return `${cipher.update(JSON.stringify(data), 'utf8', 'base64') + cipher.final('base64')}.${iv.toString('base64')}`;
}

/**
 * Decrypts an object with aes-256-cbc to use as a token
 * @param token An data to decrypt
 * @param secret The secret to decrypt the data with
 */
export function decrypt(token: string, secret: string) {
	const [data, iv] = token.split('.');
	const decipher = createDecipheriv('aes-256-cbc', secret, Buffer.from(iv, 'base64'));
	return JSON.parse(decipher.update(data, 'base64', 'utf8') + decipher.final('utf8')) as DecryptedAuth;
}

/**
 * The constructor type
 */
export type ConstructorType<V> = new (...args: unknown[]) => V;
