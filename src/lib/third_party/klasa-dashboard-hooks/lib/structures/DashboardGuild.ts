// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { DashboardClient } from '../DashboardClient';

/**
 * The dashboard guild data
 */
export type DashboardGuildData = {
	id: string;
	name: string;
	icon: string | null;
	owner: boolean;
	permissions: number;
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
	 * Whether or not the user is the owner
	 */
	public owner: boolean;

	/**
	 * The permissions of this user in this guild
	 */
	public permissions: number;

	public constructor(client: DashboardClient, data: DashboardGuildData) {
		this.client = client;
		this.owner = data.owner;
		this.permissions = data.permissions;
		this.icon = data.icon;
		this.id = data.id;
		this.name = data.name;
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
			name: this.name,
			owner: this.owner,
			permissions: this.permissions
		};
	}

}
