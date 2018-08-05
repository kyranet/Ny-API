const express = require('express');
const { Server } = require('ipc-link');
const { join } = require('path');
const bodyParser = require('body-parser');

const { api: { allowedSocialTokens } } = require('../config');
const MessageHandler = require('./MessageHandler');
const FileManager = require('./Crypto/FileManager');
const Twitch = require('./Twitch/Twitch');

const DIST_FOLDER = join(__dirname, '..', 'dist');
const ACTION_TYPES = new Set(['set', 'add', 'remove']);
const TYPE_TYPES = new Set(['money', 'points']);

/* eslint-disable new-cap */

class SkyraServer {

	constructor(options) {
		this.server = express();
		this.server.use('/static', express.static(join(DIST_FOLDER, 'static')));
		this.server.use(bodyParser.json());
		this.server.use(bodyParser.urlencoded({ extended: true }));

		this.messageHandler = new MessageHandler(this);
		this.fileManager = new FileManager(this);
		this.fileManager.init();

		this.twitch = new Twitch(this);
		this.twitch.init();

		this.ipc = new Server('dashboard', { silent: true })
			.on('message', this.messageHandler.run.bind(this.messageHandler))
			.on('disconnect', (socket) => console.error(`Disconnected socket ${socket}`))
			.on('error', console.error)
			.once('start', () => console.log('[IPC   ] Started'))
			.start();

		this.supportGuild = 'https://discordapp.com/invite/6gakFR2';
		this.donateUrl = 'https://www.patreon.com/kyranet';
		this.translateUrl = 'https://github.com/kyranet/Skyra/blob/master/LANGUAGES.md';
		this.trelloUrl = 'https://trello.com/b/PcO6zNh2';

		this.error = {
			GUILD_NOT_FOUND: [404, 'Guild not found', 'GUILD_NOT_FOUND'],
			GUILD_UNAVAILABLE: [503, 'Guild not available', 'GUILD_UNAVAILABLE'],
			USER_NOT_FOUND: [404, 'User not found', 'USER_NOT_FOUND'],
			MEMBER_NOT_FOUND: [404, 'Member not found', 'MEMBER_NOT_FOUND'],
			ROLE_NOT_FOUND: [404, 'Role not found', 'ROLE_NOT_FOUND'],
			CHANNEL_NOT_FOUND: [404, 'Channel not found', 'CHANNEL_NOT_FOUND'],
			DENIED_ACCESS: [403, 'Access denied', 'DENIED_ACCESS'],
			AUTH_REQUIRED: [401, 'This endpoint requires authentication', 'AUTH_REQUIRED'],
			AUTH_FAILED: [401, 'Invalid authentication key', 'AUTH_FAILED'],
			PARSE_ERROR: error => [400, `Failed to parse an argument. Error: ${typeof error === 'string' ? error : JSON.stringify(error)}`, 'PARSE_ERROR'],
			UNKNOWN_NEWS: news => [404, `The announcement '${news}' does not exist`, 'UNKNOWN_NEWS'],
			INVALID_ARGUMENT: (param, type) => [400, `'${param}' must be type: ${type}`, 'INVALID_ARGUMENT'],
			UNKNOWN_ENDPOINT: endpoint => [404, `Unknown /${endpoint} endpoint`, 'UNKNOWN_ENDPOINT'],
			MISSING_PERMISSION: permission => [403, `Missing permission: '${permission}'`, 'MISSING_PERMISSION'],
			ERROR: error => [401, error, 'ERROR']
		};

		// Vue
		this.server.get('/', (request, response) => {
			response.sendFile(join(DIST_FOLDER, 'index.html'));
		});

		// Redirections
		this.server.get('/invite', (req, res) => {
			this.requestIPC({ route: 'invite' }).then(data => res.redirect(data.response));
		});
		this.server.get('/join', (req, res) => {
			res.redirect(this.supportGuild);
		});
		this.server.get('/donate', (req, res) => {
			res.redirect(this.donateUrl);
		});
		this.server.get('/translate', (req, res) => {
			res.redirect(this.translateUrl);
		});
		this.server.get('/trello', (req, res) => {
			res.redirect(this.trelloUrl);
		});

		// API
		this.server.post('/api/twitch/callback/:id', async (req, res) => {
			const output = this.twitch.parse(req.params.id, req.body);
			console.log('Webhook data received:', req.body, output);
			if (output) this.requestIPC(output);
			return res.end('{"success":true}');
		});
		this.server.get('/api/gist/:id/:key', async (req, res) => {
			try {
				if (!req.params.id) return this.throw(res, ...this.error.INVALID_ARGUMENT('id', 'MISSING_ARGUMENT'));
				if (!req.params.key) return this.throw(res, ...this.error.INVALID_ARGUMENT('key', 'MISSING_ARGUMENT'));
				const result = await this.fileManager.decryptFile(req.params.id, req.params.key);
				return res.json({ success: true, data: result });
			} catch (error) {
				return this.throw(res, ...this.error.ERROR(error));
			}
		});
		this.server.param('user', async (request, response, next, value) => {
			const result = await this.requestIPC({ route: 'user', userID: value });
			if (result.success) {
				request.user = result.response;
				return next();
			}

			// Send error
			return this.throw(response, ...this.error.USER_NOT_FOUND);
		});
		this.server.get('/api/statistics', (req, res) => {
			this.requestIPC({ route: 'statistics' }).then(data => res.json(data.response));
		});
		this.server.get('/api/users/:user', (req, res) => {
			res.json({ success: true, data: req.user });
		});
		this.server.get('/api/users/:user/configs', (req, res) => {
			this.requestIPC({ route: 'userConfigs', userID: req.user.id })
				.then(data => this.sendMessage(res, data.response))
				.catch(() => this.throw(res, ...this.error.USER_NOT_FOUND));
		});
		this.server.put('/api/users/:user/configs', (req, res) => {
			if (!req.headers.authorization || !allowedSocialTokens.includes(req.headers.authorization)) return this.throw(res, ...this.error.DENIED_ACCESS);
			if (!('amount' in req.body)) return this.throw(res, ...this.error.INVALID_ARGUMENT('amount', 'MISSING_ARGUMENTS'));
			if (!('action' in req.body)) req.body.action = 'set';
			else if (!ACTION_TYPES.has(req.body.action)) return this.throw(res, ...this.error.INVALID_ARGUMENT('action', 'INVALID_TYPE'));
			if (!('type' in req.body)) req.body.type = 'money';
			else if (!TYPE_TYPES.has(req.body.type)) return this.throw(res, ...this.error.INVALID_ARGUMENT('type', 'INVALID_TYPE'));

			return this.requestIPC({ route: 'postUserConfigs', userID: req.user.id, type: req.body.type, action: req.body.action, amount: req.body.amount })
				.then(data => this.sendMessage(res, data.response))
				.catch(error => this.sendError(res, error));
		});

		this.server.listen(options.port, () => console.log(`[SERVER] Started.\n[PORT  ] ${options.port}`));
	}

	requestIPC(data) {
		return this.ipc.send('skyra-dashboard', data);
	}

	throw(res, code, message, type) {
		const output = { success: false, message };
		if (type) Object.assign(output, { type });
		res.status(code).json(output);
	}

	sendError(res, error) {
		console.error(error);
		this.throw(res, 500, error);
	}

	sendMessage(res, data) {
		res.json({ success: true, data: data.response || data });
	}

}

module.exports = new SkyraServer({ port: 1337 });
