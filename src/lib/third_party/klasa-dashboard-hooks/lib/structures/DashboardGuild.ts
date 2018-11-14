// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { Collection } from '../../../collection/lib/Collection';
import { DashboardClient } from '../DashboardClient';
import { DashboardUser } from './DashboardUser';

/**
 * The dashboard guild data
 */
export type DashboardGuildData = {
	id: string;
	name: string;
	icon: string | null;
};

export class DashboardGuild {

	/**
	 * The DashboardClient
	 */
	public client: DashboardClient;

	/**
	 * The guild id
	 */
	public id: string;

	/**
	 * The guild name
	 */
	public name: string;

	/**
	 * The guild icon hash
	 */
	public icon: string;

	/**
	 * The OAuth Users this DashboardGuild is for
	 */
	public users: Collection<string, DashboardUser> = new Collection();

	public constructor(client: DashboardClient, data: DashboardGuildData) {
		this.client = client;
		this.id = data.id;
		this.name = data.name;
		this.icon = data.icon;
	}

	/**
	 * The url for the guild's icon
	 */
	public get iconURL(): string {
		return this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png` : null;
	}

	/**
	 * The toJSON behavior of this structure
	 */
	public toJSON(): DashboardGuildData {
		return {
			icon: this.icon,
			id: this.id,
			name: this.name
		};
	}

}
