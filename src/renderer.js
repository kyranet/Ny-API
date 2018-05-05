import { Renderer } from 'marked';
import highlightjs from 'highlight.js';

// Create your custom renderer.
const renderer = new Renderer();

// Highlight.js
renderer.code = (code, language) => {
	// Check whether the given language is valid for highlight.js.
	const validLang = !!(language && highlightjs.getLanguage(language));
	// Highlight only if the language is valid.
	const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
	// Render the highlighted code with `hljs` class.
	return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

renderer.list = body => body;
renderer.listitem = body => body;

renderer.table = (header, body) => `
	<div style="overflow-x:auto;">
		<table>
			<thead>
				${header}
			</thead>
			<tbody>
				${body}
			</tbody>
		</table>
	</div>
`;

export default renderer;
