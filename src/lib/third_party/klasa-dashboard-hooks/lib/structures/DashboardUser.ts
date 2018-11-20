// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { Collection } from '../../../collection/lib/Collection';
import { DashboardClient } from '../DashboardClient';
import { DashboardGuild, DashboardGuildData } from './DashboardGuild';

/**
 * The dashboard user data
 */
export type DashboardUserData = {
	avatar: string;
	discriminator: number;
	guilds: DashboardGuildData[];
	id: string;
	locale: string;
	mfaEnabled: boolean;
	username: string;
};

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
	public guilds: Collection<string, DashboardGuild> = new Collection();

	/**
	 * The id of the OAuth User
	 */
	public id: string;

	/**
	 * The language of the OAuth User
	 */
	public locale: string;

	/**
	 * If the OAuth User has multi-factor Authentication enabled
	 */
	public mfaEnabled: boolean;

	/**
	 * The username of the OAuth User
	 */
	public username: string;

	public constructor(client: DashboardClient, data: DashboardUserData & { mfaEnabled: never; mfa_enabled: boolean }) {
		this.client = client;
		this.username = data.username;
		this.locale = data.locale;
		this.mfaEnabled = data.mfa_enabled;
		this.avatar = data.avatar;
		this.discriminator = Number(data.discriminator);
		this.id = data.id;
		for (const guild of data.guilds) this.guilds.set(guild.id, new DashboardGuild(this.client, guild));
	}

	public avatarURL(): string {
		return this.avatar
			? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
			: `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
	}

	public toJSON(): DashboardUserData {
		return {
			avatar: this.avatar,
			discriminator: this.discriminator,
			guilds: [...this.guilds.values()].map((guild) => guild.toJSON()),
			id: this.id,
			locale: this.locale,
			mfaEnabled: this.mfaEnabled,
			username: this.username,
		};
	}
}
