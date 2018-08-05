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
			.on('connect', name => console.log(`[IPC   ] Connected to ${name}`))
			.on('disconnect', name => console.warn(`[IPC   ] Disconnected from ${name}`))
			.on('destroy', name => console.warn(`[IPC   ] Destroyed connection with Node ${name}`))
			.on('error', console.error.bind(null, '[IPC   ]'))
			.on('message', this.ipcMonitors.run.bind(this.ipcMonitors));
	}

	async start(port) {
		console.log(`[IPC   ] Attempting to listen to port 8800`);
		this.ipc.serve('skyra-dashboard', 8800);

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
		return this.ipc.sendTo('skyra-dashboard', data, receptive);
	}

	static async walk(type, store) {
		const directory = join(__dirname, '..', type);
		const files = await scan(directory, { filter: (stats, path) => stats.isFile() && extname(path) === '.js' })
			.catch(() => new Map());

		console.log(`[LOADER] Loading ${files.size} elements of type ${type}...`);
		await Promise.all([...files.keys()].map(async (file) => {
			try {
				const Piece = require(file);
				const insta = new Piece(store);
				store.set(insta);
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
