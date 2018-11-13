// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
import { ConsoleBackgrounds, ConsoleTexts } from './Colors';
import { KlasaConsoleColorStyle, KlasaConsoleOptions } from './KlasaConsole';
import { mergeDefault } from './util';

const colorBase: KlasaConsoleColorStyle = {
	message: {},
	shard: { background: ConsoleBackgrounds.cyan, text: ConsoleTexts.black },
	time: {}
};

export const CONSOLE: KlasaConsoleOptions = {
	colors: {
		debug: mergeDefault(colorBase, { time: { background: ConsoleBackgrounds.magenta } }),
		error: mergeDefault(colorBase, { time: { background: ConsoleBackgrounds.red } }),
		log: mergeDefault(colorBase, { time: { background: ConsoleBackgrounds.blue } }),
		verbose: mergeDefault(colorBase, { time: { text: ConsoleTexts.gray } }),
		warn: mergeDefault(colorBase, { time: { background: ConsoleBackgrounds.lightyellow, text: ConsoleTexts.black } }),
		wtf: mergeDefault(colorBase, { message: { text: ConsoleTexts.red }, time: { background: ConsoleBackgrounds.red } })
	},
	stderr: process.stderr,
	stdout: process.stdout,
	timestamps: true,
	types: {
		debug: 'log',
		error: 'error',
		log: 'log',
		verbose: 'log',
		warn: 'warn',
		wtf: 'error'
	},
	utc: false
};

export const TIMES = {
	DAY: 1000 * 60 * 60 * 24,
	HOUR: 1000 * 60 * 60,
	MINUTE: 1000 * 60,
	SECOND: 1000,

	DAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

	TIMESTAMP: {
		TOKENS: {
			A: 1,
			D: 4,
			H: 2,
			L: 4,
			M: 4,
			Q: 1,
			S: 3,
			T: 1,
			X: 1,
			Y: 4,
			Z: 2,
			a: 1,
			d: 4,
			h: 2,
			l: 4,
			m: 2,
			s: 2,
			t: 1,
			x: 1
		}
	}

};
