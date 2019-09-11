// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { DashboardClient } from '../DashboardClient';
import { DashboardUser } from './DashboardUser';
import { Collection } from '../../../discord.js';

/**
 * The dashboard guild data
 */
export interface DashboardGuildData {
	id: string;
	name: string;
	icon: string | null;
}

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
	public icon: string | null;

	/**
	 * The OAuth Users this DashboardGuild is for
	 */
	public users = new Collection<string, DashboardUser>();

	public constructor(client: DashboardClient, data: DashboardGuildData) {
		this.client = client;
		this.id = data.id;
		this.name = data.name;
		this.icon = data.icon;
	}

	/**
	 * The url for the guild's icon
	 */
	public get iconURL() {
		return this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png` : null;
	}

	/**
	 * The toJSON behavior of this structure
	 */
	public toJSON() {
		return {
			icon: this.icon,
			id: this.id,
			name: this.name
		} as DashboardGuildData;
	}

}
