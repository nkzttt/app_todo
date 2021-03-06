import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './_vue/app.vue';
import List from './_vue/list.vue';
import Detail from './_vue/detail.vue';
import Search from './_vue/search.vue';
import Store from './_lib/store'

// use plugins
Vue.use(VueRouter);
Vue.use(Vuex);

// setup routing
const routes = [
	{path: '/', component: List},
	{path: '/detail/:index', component: Detail},
	{path: '/search', component: Search}
];

const router = new VueRouter({
	routes
});

// setup store
const store = new Vuex.Store(Store);

// setup app
new Vue({
	router,
	store,
	render: function (createElement) {
    return createElement(App)
  }
}).$mount('#app');
