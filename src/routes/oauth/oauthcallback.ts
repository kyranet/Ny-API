import { ServerResponse } from 'http';
import fetch from 'node-fetch';
import { URL } from 'url';
import { encrypt, KlasaIncomingMessage, RESPONSES, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public constructor(store: RouteStore, file: string[], directory: string) {
		super(store, file, directory, { route: '/oauth/callback', authenticated: true });
	}

	public get oauthUser(): Route {
		return this.store.get('oauthUser') as Route;
	}

	public async post(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		if (!request.body.code) {
			this.noCode(response);
			return;
		}
		const url = new URL('https://discordapp.com/api/oauth2/token');
		url.searchParams.append('grant_type', 'authorization_code');
		url.searchParams.append('redirect_uri', request.body.redirectUri);
		url.searchParams.append('code', request.body.code);
		const res = await fetch(url as any, {
			headers: { Authorization: `Basic ${Buffer.from(`${this.client.options.clientID}:${this.client.options.clientSecret}`).toString('base64')}` },
			method: 'POST'
		});
		if (!res.ok) {
			response.end(RESPONSES.FETCHING_TOKEN);
			return;
		}

		const { oauthUser } = this;

		if (!oauthUser) {
			this.notReady(response);
			return;
		}

		const body = await res.json();
		const user = await (oauthUser as any).api(body.access_token);

		response.end(JSON.stringify({
			access_token: encrypt({
				scope: [user.id, ...user.guilds.map(guild => guild.id)],
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
