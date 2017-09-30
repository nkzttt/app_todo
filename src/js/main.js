import Vue from 'vue';
import App from './_vue/app.vue';

new Vue({
	el: '#app',
	render: function (createElement) {
		return createElement(App)
	}
});
