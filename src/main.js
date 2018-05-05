import Vue from 'vue';
import marked from 'marked';
import VueHighlightJS from 'vue-highlightjs';

import App from './App';
import router from './router.js';
import Buefy from 'buefy';
import renderer from './renderer.js';

Vue.config.productionTip = false;

// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS);

// Tell Vue.js to use buefy
Vue.use(Buefy, { defaultIconPack: 'fa' });

// Set the renderer to marked.
marked.setOptions({ renderer });

Vue.filter('marked', text => {
	if (!text) text = '';
	return marked(text);
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
	render(el) {
		return el(App);
	}
});
