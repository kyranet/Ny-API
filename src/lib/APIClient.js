const IPCMonitorStore = require('./structures/IPCMonitorStore');
const { RouteStore, MiddlewareStore, Server } = require('./external/klasa-dashboard-hooks');
const { Node } = require('veza');

const { join, extname } = require('path');
const { scan } = require('fs-nextra');

class APIClient {

	constructor() {
		this.server = new Server(this);
		this.routes = new RouteStore(this);
		this.middlewares = new MiddlewareStore(this);
		this.ipcMonitors = new IPCMonitorStore(this);
		this.ipc = new Node('skyra-dashboard')
			.on('client.identify', (client) => console.log(`[IPC   ] Client Connected: ${client.name}`))
			.on('client.disconnect', (client) => console.log(`[IPC   ] Client Disconnected: ${client.name}`))
			.on('client.destroy', (client) => console.log(`[IPC   ] Client Destroyed: ${client.name}`))
			.on('server.ready', (server) => console.log(`[IPC   ] Client Ready: Named ${server.name}`))
			.on('error', (error, client) => console.error(`[IPC   ] Error from ${client.name}`, error))
			.on('message', this.ipcMonitors.run.bind(this.ipcMonitors));
	}

	async start(port) {
		console.log(`[IPC   ] Attempting to listen to port 8800`);
		this.ipc.serve(8800);

		console.log(`[HTTP  ] Attempting to listen to port ${port}...`);
		await this.server.listen(port).catch((error) => {
			console.error(error);
			process.exit(1);
		});
		console.log(`[HTTP  ] Listening to port ${port}...`);

		await Promise.all([
			APIClient.walk('routes', this.routes),
			APIClient.walk('ipcMonitors', this.ipcMonitors),
			APIClient.walk('middlewares', this.middlewares)
		]);
		console.log(`[READY ] Successfully initialised.`);
	}

	ipcRequest(data, receptive = true) {
		return this.ipc.sendTo('skyra-bot', data, { receptive, timeout: 10000 });
	}

	static async walk(type, store) {
		const directory = join(__dirname, '..', type);
		const files = await scan(directory, { filter: (stats, path) => stats.isFile() && extname(path) === '.js' })
			.catch(() => new Map());

		await Promise.all([...files.keys()].map(async (file) => {
			try {
				const Piece = require(file);
				const instance = new Piece(store);
				store.set(instance);
				return store;
			} catch (error) {
				console.error(error);
				return null;
			} finally {
				delete require.cache[file];
			}
		}));
		console.log(`[LOADER] Loaded ${store.size} elements of type ${type}.`);
	}

}

module.exports = APIClient;
