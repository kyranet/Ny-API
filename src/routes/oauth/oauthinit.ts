import { ServerResponse } from 'http';
import { URL } from 'url';
import { APIClient } from '../../lib/APIClient';
import { DashboardClient, KlasaIncomingMessage, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

import {OAUTH2_OPTIONS} from "./../../../config";

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/oauth/init', authenticated: false });
	}

	public get(_request: KlasaIncomingMessage, response: ServerResponse): void {

		const url = new URL('https://discordapp.com/api/oauth2/authorize');
		
		// @todo: implement state https://discordapp.com/developers/docs/topics/oauth2#state-and-security
		url.searchParams.append('client_id', this.client.options.clientID);
		url.searchParams.append('client_secret', this.client.options.clientSecret);
		url.searchParams.append('response_type', 'code');
		url.searchParams.append('redirect_uri', OAUTH2_OPTIONS.redirectUris);
		url.searchParams.append('scope', OAUTH2_OPTIONS.scopes.join(" "));

		response.writeHead(302, {
			'Location': url.toString()
		});
		response.end();
	}

}
