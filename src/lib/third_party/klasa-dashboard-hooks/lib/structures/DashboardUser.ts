// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { DashboardClient } from '../DashboardClient';
import { DashboardGuild, DashboardGuildData } from './DashboardGuild';
import { Collection } from '../../../discord.js';

/**
 * The dashboard user data
 */
export interface DashboardUserData {
	avatar: string | null;
	discriminator: number;
	guilds: DashboardGuildData[];
	id: string;
	locale: string | null;
	mfaEnabled: boolean;
	username: string;
}

export class DashboardUser {

	/**
	 * The DashboardClient
	 */
	public client: DashboardClient;

	/**
	 * The OAuth User's avatar hash
	 */
	public avatar: string | null;

	/**
	 * The discriminator of the OAuth User
	 */
	public discriminator: number;

	/**
	 * The collection of OAuth Guilds this OAuth User is in
	 */
	public guilds = new Collection<string, DashboardGuild>();

	/**
	 * The id of the OAuth User
	 */
	public id: string;

	/**
	 * The language of the OAuth User
	 */
	public locale: string | null;

	/**
	 * If the OAuth User has multi-factor Authentication enabled
	 */
	public mfaEnabled: boolean;

	/**
	 * The username of the OAuth User
	 */
	public username: string;

	public constructor(client: DashboardClient, user: any) {
		/**
		 * The DashboardClient
		 * @since 0.0.1
		 * @type {DashboardClient}
		 */
		this.client = client;

		/**
		 * The id of the OAuth User
		 * @since 0.0.1
		 * @type {string}
		 */
		this.id = user.id;

		/**
		 * The username of the OAuth User
		 * @since 0.0.1
		 * @type {string}
		 */
		this.username = user.username;

		/**
		 * The discriminator of the OAuth User
		 * @since 0.0.1
		 * @type {number}
		 */
		this.discriminator = parseInt(user.discriminator, 10);

		/**
		 * The language of the OAuth User
		 * @since 0.0.1
		 * @type {string}
		 */
		this.locale = user.locale;

		/**
		 * If the OAuth User has multi-factor Authentication enabled
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.mfaEnabled = user.mfa_enabled;

		/**
		 * The OAuth User's avatar hash
		 * @since 0.0.1
		 * @type {string}
		 */
		this.avatar = user.avatar;

		/**
		 * The collection of OAuth Guilds this OAuth User is in
		 * @since 0.0.1
		 * @type {external:Collection<external:snowflake, DashboardGuild>}
		 */
		this.guilds = new Collection();
	}

	public avatarURL() {
		return this.avatar
			? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
			: `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
	}

	public toJSON() {
		return {
			avatar: this.avatar,
			discriminator: this.discriminator,
			guilds: [...this.guilds.values()].map(guild => guild.toJSON()),
			id: this.id,
			locale: this.locale,
			mfaEnabled: this.mfaEnabled,
			username: this.username
		} as DashboardUserData;
	}

}
