import Vue from 'vue';
import Network from 'vue-vis-network';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.component('network', Network);
new Vue({
  router,
  store,
  vuetify,
  Network,
  render: (h) => h(App),
}).$mount('#app');
