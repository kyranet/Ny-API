import Vue from 'vue';
import App from './App';
import router from './router.js';
import Buefy from 'buefy';

Vue.config.productionTip = false;

Vue.use(Buefy, { defaultIconPack: 'fa' });

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
