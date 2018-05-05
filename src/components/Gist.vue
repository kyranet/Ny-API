<template>
    <div class="content hero is-primary is-medium">
        <div class="hero-body">
			<div class="container is-fullhd">
				<div class="notification has-text-dark">
					<p v-if="!content">You need to write the key.</p>
					<div v-else v-html="content"></div>
				</div>
			</div>
        </div>
    </div>

</template>

<script>
import Vue from 'vue';

export default {
	name: "Gist",
	data() {
		return {
			id: this.getParameterByName('id'),
			key: this.getParameterByName('key'),
			type: null,
			content: ''
		}
	},
	methods: {
		getParameterByName(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		},
		gistFetch() {
			if (this.$data.id && this.$data.key) fetch('https://skyradiscord.com/api/gist/' + this.$data.id + '/' + this.$data.key)
				.then(result => result.json())
				.then(value => {
					var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
					var timeFormat = new Intl.DateTimeFormat(window.navigator.userLanguage || window.navigator.language, options);
					var _marked = Vue.filter('marked');
					value = JSON.parse(value.data);
					this.$data.type = value.type;
					if (this.type === 'MESSAGE_GIST') {
						for (let i = 0; i < value.text.length; i++) {
							var item = value.text[i];
							this.$data.content += `
							<div class="notification is-primary">
								<h3>${item.author}<span>${timeFormat.format(item.createdTimestamp)}</span></h3>
								${_marked(item.cleanContent.replace(/([^\n])```/g, '$1\n```'))}
								${item.attachments.length ? item.attachments.map(att => `<a href="${att.url}"><img src="${att.url}" height="${att.height}" width="${att.width}"></a>`) : ''}
								${item.embeds.length ? item.embeds.map(emb => `<a href="${emb.url}"><img src="${emb.url}" height="${emb.height}" width="${emb.width}"></a>`) : ''}
							</div>${i !== value.text.length - 1 ? '<hr/>' : ''}`;
						}
					}
				});
		}
	},
	beforeMount() {
		this.gistFetch();
	}
};
</script>

<style scoped>
div.notification > p {
	white-space: pre-wrap;
}
</style>


<style>
::-webkit-scrollbar {
    width: 5px;
}
::-webkit-scrollbar-track {
    background: #2F3136;
    border-radius: 5px;
}
::-webkit-scrollbar-thumb {
    background: #1E2124;
    border-radius: 5px;
}
.content:not(:last-child) {
    margin-bottom: 0%;
}
div.hero-body > div.container.is-fullhd > div.notification.has-text-dark {
	background-color: #36393E;
	color: rgba(255, 255, 255, 0.7);
}
div.hero-body > div.container.is-fullhd > div.notification.has-text-dark > div > hr {
	margin: 0;
	background-color: #3E4146;
}
div.notification.is-primary {
	background-color: #36393E;
	margin-bottom: 0;
}
div.notification.is-primary > h3 {
	color: rgba(255, 255, 255, 0.7);
	font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size: 18px;
}
div.notification.is-primary > h3 > span {
	color: rgba(255, 255, 255, 0.6);
	font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size: 14px;
	padding-left: 7px;
}
div.notification.is-primary > p {
	color: rgba(255, 255, 255, 0.7);
	font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
	font-size: 15px;
}
div.notification.is-primary > pre {
	padding: 0;
	background-color: transparent;
}
div.notification.is-primary > pre > code.hljs {
	background: #2f3136;
	border: 2px solid #282b30;
    border-radius: 5px;
    box-sizing: border-box;
	margin: 0;
    outline: 0;
    padding: 4px;
    vertical-align: baseline;
	font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
	font-size: 12px;
}
div.notification.is-primary .content pre:not(:last-child) {
	margin-bottom: 3em;
}
</style>
