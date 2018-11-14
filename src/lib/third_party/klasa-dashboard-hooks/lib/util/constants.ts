// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { METHODS } from 'http';
import { HttpMethods } from '../structures/RouteStore';

export const OPTIONS = {
	dashboardHooks: {
		apiPrefix: 'api/',
		http2: false,
		origin: '*',
		port: 4000
	},
	pieceDefaults: {
		middlewares: { enabled: true },
		routes: {
			authenticated: false,
			enabled: true
		}
	}
};

export const METHODS_LOWER: Record<keyof typeof HttpMethods, string> = {} as Record<keyof typeof HttpMethods, string>;
for (const method of METHODS) METHODS_LOWER[method] = method.toLowerCase();

export const RESPONSES = {
	FETCHING_TOKEN: '{"message":"Error fetching token"}',
	NOT_READY: '{"message":"No OAuth User Route Loaded"}',
	NO_CODE: '{"message":"No code provided"}',
	OK: '{"message":"Ok"}',
	UNAUTHORIZED: '{"message":"Unauthorized"}',
	UPDATED: [
		'{"updated":false}',
		'{"updated":true}'
	]
};
