<template>
	<nav class="navbar has-shadow is-desktop" role="navigation" aria-label="dropdown navigation">
		<div class="container is-fullhd">
		<div class="navbar-brand">
			<router-link class="navbar-item title is-4 is-marginless" to="/">
				<img :src="`https://cdn.discordapp.com/avatars/${app.id}/${app.icon}.png?size=32`" width="28" height="28">&nbsp;&nbsp;{{ app.name }}
			</router-link>

			<p class="navbar-item"> Serving&nbsp;&nbsp;<span class="tag is-dark">{{ app.guilds }} Guilds</span></p>

			<div class="navbar-burger burger" @click="toggle()">
				<span />
				<span />
				<span />
			</div>
		</div>

		<div :class="`navbar-menu ${visible ? 'is-active' : ''}`">
			<div class="navbar-end">
				<router-link class="navbar-item" to="/about">About</router-link>
				<router-link class="navbar-item" to="/commands">Commands</router-link>
				<router-link class="navbar-item" to="/statistics">Statistics</router-link>

				<a href="/invite" class="navbar-item">Invite</a>
				<a href="/join" class="navbar-item">Join</a>

				<div class="navbar-item has-dropdown is-hoverable" v-if="user.id !== null">
					<a class="navbar-item">
						{{ user.username }}
					</a>
					<div class="navbar-dropdown is-boxed">
						<router-link class="navbar-item" :to="`/users/${user.id}`">Profile</router-link>
						<router-link class="navbar-item" to="/dashboard">Dashboard</router-link>
						<router-link class="navbar-item" to="/admin" v-if="user.id === '242043489611808769'">Admin</router-link>
					</div>
				</div>
			</div>
		</div>
		</div>
	</nav>
</template>

<script>
export default {
	name: 'AppNavbar',
	// props: ['app', 'user'],
	data() {
		return {
			visible: false,
			app: {
				name: 'Skyra',
				id: '266624760782258186',
				icon: '32580fffe4ee23e4933252148e6d3f23',
				guilds: 220
			},
			user: {
				id: null,
				username: null
			}
		}
	},
	methods: {
		toggle() {
			this.visible = !this.visible;
		}
	}
};
</script>
