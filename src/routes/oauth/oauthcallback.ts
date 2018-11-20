import { ServerResponse } from 'http';
import fetch from 'node-fetch';
import { URL } from 'url';
import { APIClient } from '../../lib/APIClient';
import { DashboardClient, encrypt, KlasaIncomingMessage, RESPONSES, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

import {OAUTH2_OPTIONS} from "./../../../config";

export default class extends Route {

	public client: APIClient;

	public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string) {
		super(client, store, file, directory, { route: '/oauth/callback', authenticated: false });
	}

	public get oauthUser(): Route {
		return this.store.get('oauthuser') as Route;
	}

	public async get(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (!request.query.code || typeof request.query.code !== "string") {
			this.noCode(response);
			return;
		}
		
		const url = new URL('https://discordapp.com/api/oauth2/token');
		
		url.searchParams.append('client_id', this.client.options.clientID);
		url.searchParams.append('client_secret', this.client.options.clientSecret);
		url.searchParams.append('grant_type', 'authorization_code');
		url.searchParams.append('redirect_uri', OAUTH2_OPTIONS.redirectUris);
		url.searchParams.append('code', request.query.code);
		url.searchParams.append('scope', OAUTH2_OPTIONS.scopes.join(" "));
		
		const res = await fetch(url as any, {
			method: 'POST'
		});
		if (!res.ok) {
			response.end(RESPONSES.FETCHING_TOKEN);
			return;
		}

		const oauthUser = this.oauthUser;

		if (!oauthUser) {
			this.notReady(response);
			return;
		}

		const body = await res.json();
		const user = await (oauthUser as any).api(body.access_token);

		response.end(JSON.stringify({
			access_token: encrypt({
				scope: [user.id, ...user.guilds.map((guild) => guild.id)],
				token: body.access_token
			}, this.client.options.clientSecret),
			user
		}));
	}

	public notReady(response: ServerResponse): void {
		response.writeHead(500);
		response.end(RESPONSES.NOT_READY);
	}

	public noCode(response: ServerResponse): void {
		response.writeHead(400);
		response.end(RESPONSES.NO_CODE);
	}

}
