import { ServerResponse } from 'http';
import fetch from 'node-fetch';
import { APIClient } from '../../lib/APIClient';
import { DashboardUser, encrypt, KlasaIncomingMessage, Route, RouteStore } from '../../lib/third_party/klasa-dashboard-hooks';

export default class extends Route {

	public client!: APIClient;

	public constructor(store: RouteStore, file: string[], directory: string) {
		super(store, file, directory, { route: '/oauth/user', authenticated: true });
	}

	public async api(token: string): Promise<DashboardUser> {
		token = `Bearer ${token}`;
		const user = await fetch('https://discordapp.com/api/users/@me', { headers: { Authorization: token } })
			.then(result => result.json());
		user.guilds = await fetch('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: token } })
			.then(result => result.json());
		return this.client.dashboardUsers.add(user);
	}

	public async get(request: KlasaIncomingMessage, response: ServerResponse): Promise<void> {
		let dashboardUser = this.client.dashboardUsers.get(request.auth!.scope[0]);

		if (!dashboardUser) {
			dashboardUser = await this.api(request.auth!.token);
			response.setHeader('Authorization', encrypt({
				scope: [dashboardUser.id, ...dashboardUser.guilds.map(guild => guild.id)],
				token: request.auth!.token
			}, this.client.options.clientSecret));
		}

		response.end(JSON.stringify({ success: true, data: dashboardUser }));
	}

}
