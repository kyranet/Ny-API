import Vue from 'vue';
import Router from 'vue-router';
import Homepage from '@/components/Homepage';
// import CommandsPage from '@/components/Commands';
// import StatsPage from '@/components/Stats';

Vue.use(Router);

export default new Router({
	routes: [
		{ path: '/', name: 'Homepage', component: Homepage },
		{
			path: '/invite', beforeEnter(__, ___, next) {
				window.location = 'https://discordapp.com/oauth2/authorize?client_id=266624760782258186&permissions=356838422&scope=bot';
				next(false);
			}
		},
		{
			path: '/join', beforeEnter(__, ___, next) {
				window.location = 'https://discordapp.com/invite/6gakFR2';
				next(false);
			}
		}
		// { path: '/commands', name: 'Commands', component: CommandsPage },
		// { path: '/stats', name: 'Stats', component: StatsPage }
	]
});
