import Vue from 'vue';
import Router from 'vue-router';
import Homepage from '@/components/Homepage';
// import CommandsPage from '@/components/Commands';
// import StatsPage from '@/components/Stats';

Vue.use(Router);

export default new Router({
	routes: [
		{ path: '/', name: 'Homepage', component: Homepage }
		// { path: '/commands', name: 'Commands', component: CommandsPage },
		// { path: '/stats', name: 'Stats', component: StatsPage }
	]
});
