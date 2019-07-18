// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
/**
 * The close codes
 */
export enum ConsoleClose {
	normal = 0,
	bold = 22,
	dim = 22,
	italic = 23,
	underline = 24,
	inverse = 27,
	hidden = 28,
	strikethrough = 29,
	text = 39,
	background = 49
}

/**
 * The style codes
 */
export enum ConsoleStyles {
	normal = 0,
	bold = 1,
	dim = 2,
	italic = 3,
	underline = 4,
	inverse = 7,
	hidden = 8,
	strikethrough = 9
}

/**
 * The text codes
 */
export enum ConsoleTexts {
	black = 30,
	red = 31,
	green = 32,
	yellow = 33,
	blue = 34,
	magenta = 35,
	cyan = 36,
	gray = 90,
	grey = 90,
	lightblue = 94,
	lightcyan = 96,
	lightgreen = 92,
	lightgray = 37,
	lightgrey = 37,
	lightmagenta = 95,
	lightred = 91,
	lightyellow = 93,
	white = 97
}

/**
 * The background codes
 */
export enum ConsoleBackgrounds {
	black = 40,
	red = 41,
	green = 42,
	yellow = 43,
	blue = 44,
	magenta = 45,
	cyan = 46,
	gray = 47,
	grey = 47,
	lightblue = 104,
	lightcyan = 106,
	lightgreen = 102,
	lightgray = 100,
	lightgrey = 100,
	lightmagenta = 105,
	lightred = 101,
	lightyellow = 103,
	white = 107
}

export class Colors {

	/**
	 * The opening tags
	 */
	private readonly opening: string;

	/**
	 * The closing tags
	 */
	private readonly closing: string;

	public constructor(options: ColorsFormatOptions = {}) {
		const { opening, closing } = Colors.text(options.text, Colors.background(options.background, Colors.style(options.style)));
		this.opening = `\u001B[${opening!.join(';')}m`;
		this.closing = `\u001B[${closing!.join(';')}m`;
	}

	/**
	 * Format a string
	 * @param input The string to format
	 */
	public format(input: string): string {
		return this.opening + input + this.closing;
	}

	/**
	 * Apply the style
	 * @param styles The style or styles to apply
	 * @param data The data
	 */
	private static style(styles?: ConsoleTexts | ConsoleTexts[], { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (styles) {
			if (!Array.isArray(styles)) styles = [styles];
			for (const style of styles) {
				opening.push(ConsoleStyles[ConsoleStyles[style]]);
				closing.push(ConsoleClose[ConsoleStyles[style]]);
			}
		}
		return { opening, closing };
	}

	/**
	 * Apply the background
	 * @since 0.5.0
	 * @param background The background to apply
	 * @param data The data
	 */
	private static background(background?: ConsoleBackgrounds, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (background) {
			opening.push(ConsoleBackgrounds[ConsoleBackgrounds[background]]);
			closing.push(ConsoleClose.background);
		}
		return { opening, closing };
	}

	/**
	 * Apply the text format
	 * @since 0.5.0
	 * @param text The text format to apply
	 * @param data The data
	 */
	private static text(text?: ConsoleTexts, { opening = [], closing = [] }: ColorsFormatData = {}): ColorsFormatData {
		if (text) {
			opening.push(ConsoleTexts[ConsoleTexts[text]]);
			closing.push(ConsoleClose.text);
		}
		return { opening, closing };
	}

}

/**
 * The color format options
 */
export interface ColorsFormatOptions {
	/**
	 * The style or styles to apply
	 */
	style?: ConsoleTexts | ConsoleTexts[];
	/**
	 * The format for the background
	 */
	background?: ConsoleBackgrounds;
	/**
	 * The format for the text
	 */
	text?: ConsoleTexts;
}

/**
 * The format data used during parsing
 */
interface ColorsFormatData {
	/**
	 * The opening format data styles
	 */
	opening?: number[];
	/**
	 * The closing format data styles
	 */
	closing?: number[];
}
