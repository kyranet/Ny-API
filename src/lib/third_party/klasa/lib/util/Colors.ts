// Copyright (c) 2017-2018 dirigeants. All rights reserved. MIT license.
export class Colors {

	/**
	 * The opening tags
	 */
	private opening: string;

	/**
	 * The closing tags
	 */
	private closing: string;

	public constructor(options: ColorsFormatOptions = {}) {
		const { opening, closing } = Colors.text(options.text, Colors.background(options.background, Colors.style(options.style)));
		this.opening = `\u001B[${opening.join(';')}m`;
		this.closing = `\u001B[${closing.join(';')}m`;
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

export type ColorsFormatOptions = {
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
};

type ColorsFormatData = {
	/**
	 * The opening format data styles
	 */
	opening?: number[];
	/**
	 * The closing format data styles
	 */
	closing?: number[];
};

/**
 * The close codes
 */
export enum ConsoleClose {
	/**
	 * Default style
	 */
	normal = 0,
	/**
	 * Bold style. May appear with a lighter colour in many terminals
	 */
	bold = 22,
	/**
	 * Dim style
	 */
	dim = 22,
	/**
	 * Italic style
	 */
	italic = 23,
	/**
	 * Underline style
	 */
	underline = 24,
	/**
	 * Inverse colours style
	 */
	inverse = 27,
	/**
	 * Hidden text style
	 */
	hidden = 28,
	/**
	 * Strikethrough text style
	 */
	strikethrough = 29,
	text = 39,
	background = 49
}

/**
 * The style codes
 */
export enum ConsoleStyles {
	/**
	 * Default style
	 */
	normal = 0,
	/**
	 * Bold style. May appear with a lighter colour in many terminals
	 */
	bold = 1,
	/**
	 * Dim style
	 */
	dim = 2,
	/**
	 * Italic style
	 */
	italic = 3,
	/**
	 * Underline style
	 */
	underline = 4,
	/**
	 * Inverse colours style
	 */
	inverse = 7,
	/**
	 * Hidden text style
	 */
	hidden = 8,
	/**
	 * Strikethrough text style
	 */
	strikethrough = 9
}

/**
 * The text codes
 */
export enum ConsoleTexts {
	/**
	 * The black color
	 */
	black = 30,
	/**
	 * The red color
	 */
	red = 31,
	/**
	 * The green color
	 */
	green = 32,
	/**
	 * The yellow color
	 */
	yellow = 33,
	/**
	 * The blue color
	 */
	blue = 34,
	/**
	 * The magenta color
	 */
	magenta = 35,
	/**
	 * The cyan color
	 */
	cyan = 36,
	/**
	 * The gray color
	 */
	gray = 90,
	grey = 90,
	/**
	 * The light blue color
	 */
	lightblue = 94,
	/**
	 * The light cyan color
	 */
	lightcyan = 96,
	/**
	 * The light green color
	 */
	lightgreen = 92,
	/**
	 * The light grey color
	 */
	lightgray = 37,
	lightgrey = 37,
	/**
	 * The light magenta color
	 */
	lightmagenta = 95,
	/**
	 * The light red color
	 */
	lightred = 91,
	/**
	 * The light yellow color
	 */
	lightyellow = 93,
	/**
	 * The white color
	 */
	white = 97
}

/**
 * The background codes
 */
export enum ConsoleBackgrounds {
	/**
	 * The black color
	 */
	black = 40,
	/**
	 * The red color
	 */
	red = 41,
	/**
	 * The green color
	 */
	green = 42,
	/**
	 * The yellow color
	 */
	yellow = 43,
	/**
	 * The blue color
	 */
	blue = 44,
	/**
	 * The magenta color
	 */
	magenta = 45,
	/**
	 * The cyan color
	 */
	cyan = 46,
	/**
	 * The gray color
	 */
	gray = 47,
	grey = 47,
	/**
	 * The light blue color
	 */
	lightblue = 104,
	/**
	 * The light cyan color
	 */
	lightcyan = 106,
	/**
	 * The light green color
	 */
	lightgreen = 102,
	/**
	 * The light grey color
	 */
	lightgray = 100,
	lightgrey = 100,
	/**
	 * The light magenta color
	 */
	lightmagenta = 105,
	/**
	 * The light red color
	 */
	lightred = 101,
	/**
	 * The light yellow color
	 */
	lightyellow = 103,
	/**
	 * The white color
	 */
	white = 107
}
