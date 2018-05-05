const { crypto: { ALGORITHM, PASSWORD, IV } } = require('../../config');
const { createCipheriv, createDecipheriv, randomBytes } = require('crypto');
const { writeFile, readFile, pathExists, remove, ensureDir, readdir, stat } = require('fs-nextra');
const { join, parse } = require('path');

const FOLDER = join(__dirname, '..', '..', 'bwd', 'encryptedFiles');
const MANAGER = join(FOLDER, 'keys');
const MONTH = 1000 * 60 * 60 * 24 * 30;

class FileManager {

	constructor(client) {
		this.client = client;
		this.cache = null;
	}

	async init() {
		if (!await pathExists(FOLDER)) await ensureDir(FOLDER);

		if (!await pathExists(MANAGER)) {
			await writeFile(MANAGER, this.encrypt('[]', PASSWORD), 'utf8');
			this.cache = new Map();
		} else {
			let status = 0, decrypted, parsed;
			try {
				decrypted = this.decrypt(await readFile(MANAGER, 'utf8'), PASSWORD);
				status++;
				parsed = JSON.parse(decrypted);
				status++;
				this.cache = new Map(parsed);
				status++;
			} catch (error) {
				switch (status) {
					case 0: console.error(`Failed to decrypt the file ${MANAGER}: ${error.stack}`); break;
					case 1: console.error(`Failed to parse the decrypted file ${MANAGER}: Decrypted content was: ${decrypted}. Error stack:\n${error.stack}`); break;
					case 2: console.error(`Failed to Map the parsed file ${MANAGER}: Parsed content was: ${parsed}. Error stack:\n${error.stack}`); break;
				}
			}
		}

		return this;
	}

	async sweep() {
		const files = await this.listFiles();
		const birth = Date.now() - MONTH;

		let deleted = 0;
		await Promise.all(files.map(file => stat(join(FOLDER, file))
			.then(stats => stats.birthtime < birth
				? remove(join(FOLDER, file)).then(() => { deleted++; this.cache.delete(parse(file).name); })
				: null
			)
		));

		if (deleted) await this.updateManager();
		return deleted;
	}

	generatePassword() {
		return randomBytes(16).toString('hex');
	}

	encrypt(text, password) {
		const cipher = createCipheriv(ALGORITHM, password, IV);
		return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
	}

	decrypt(text, password) {
		const decipher = createDecipheriv(ALGORITHM, password, IV);
		return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
	}

	async encryptFile(name, text) {
		if (this.cache.has(name)) throw `The file ${name} already exists.`;
		const password = this.generatePassword();
		await writeFile(this.resolveFilename(name), this.encrypt(text, password), 'utf8');
		this.cache.set(name, password);
		await this.updateManager();

		return password;
	}

	async decryptFile(name, password) {
		if (!this.checkPassword(name, password)) throw `INVALID_PASSWORD`;
		const text = await readFile(this.resolveFilename(name), 'utf8');
		return this.decrypt(text, password);
	}

	async destroyFile(name) {
		if (!this.cache.has(name)) throw `The file ${name} does not exist.`;
		await remove(this.resolveFilename(name));
		this.cache.delete(name);
		await this.updateManager();
	}

	listFiles() {
		return readdir(FOLDER);
	}

	checkPassword(name, password) {
		const entry = this.cache.get(name);
		return entry && entry === password;
	}

	resolveFilename(name) {
		return join(FOLDER, `${name}.txt`);
	}

	updateManager() {
		return writeFile(MANAGER, this.encrypt(JSON.stringify([...this.cache]), PASSWORD), 'utf8');
	}

}

module.exports = FileManager;
