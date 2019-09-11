import { Collection as BaseCollection } from '@discordjs/collection';

export class Collection<K, V> extends BaseCollection<K, V> {


	public toJSON(): unknown {
		return {};
	}

}
