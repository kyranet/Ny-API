const { readJSON, pathExists, outputJSONAtomic } = require('fs-nextra');
const { post } = require('snekfetch');
const { join } = require('path');

const { twitch: { CLIENT_ID, SECRET, CALLBACK_URL } } = require('../../config');
const FOLDER = join(__dirname, '..', '..', 'bwd', 'twitch');
const SUBSCRIPTIONS = join(FOLDER, 'subscriptions.json');

class Twitch {

	constructor(client) {
		this.client = client;
		this.cache = null;
	}

	async init() {
		let data;
		if (await pathExists(FOLDER)) data = await readJSON(SUBSCRIPTIONS);
		else await outputJSONAtomic(SUBSCRIPTIONS, []).then(() => { data = []; });

		this.cache = new Map(data);
	}

	parse(id, input) {
		if (!this.subscribed(id)) return null;
		if (!input.data.length) return { id, streaming: false };
		const [data] = input.data;
		return {
			id,
			streaming: true,
			gameID: data.game_id,
			title: data.title,
			startedAt: new Date(data.started_at).getTime(),
			thumbnail: data.thumbnail_url || null
		};
	}

	subscribed(id) {
		return this.cache.has(id);
	}

	async subscribe(id) {
		let cache = this.cache.get(id);
		if (cache) {
			cache.subscriptions++;
		} else {
			this.cache.set(id, cache = { subscriptions: 1 });
			await post('https://api.twitch.tv/helix/webhooks/hub')
				.set('Client-ID', CLIENT_ID)
				.set('Content-Type', 'application/json')
				.send({
					'hub.mode': 'subscribe',
					'hub.topic': `https://api.twitch.tv/helix/users/follows?to_id=${id}`,
					'hub.callback': `${CALLBACK_URL}/${id}`,
					// 'hub.lease_seconds': '864000',
					'hub.secret': SECRET
				});
		}
		await outputJSONAtomic(SUBSCRIPTIONS, [...this.cache]);

		return cache.subscriptions;
	}

	async unsubscribe(id) {
		const cache = this.cache.get(id);
		if (cache) {
			if (cache.subscriptions === 1) {
				await post('https://api.twitch.tv/helix/webhooks/hub')
					.set('Client-ID', CLIENT_ID)
					.set('Content-Type', 'application/json')
					.send({
						'hub.mode': 'unsubscribe',
						'hub.topic': `https://api.twitch.tv/helix/users/follows?to_id=${id}`,
						'hub.callback': `${CALLBACK_URL}/${id}`
					});
				this.cache.delete(id);
			}
			cache.subscriptions--;

			await outputJSONAtomic(SUBSCRIPTIONS, [...this.cache]);
		}

		return cache ? cache.subscriptions : null;
	}

}

module.exports = Twitch;
