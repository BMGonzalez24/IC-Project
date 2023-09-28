import Vue from 'vue';
import Vuesax from 'vuesax';
import ShortKey from 'vue-shortkey';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'vuesax/dist/vuesax.min.css';
import '@/scss/_variables.scss';
import '@/scss/helpers.scss';

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = (msg) => {
  // eslint-disable-next-line no-useless-return
  if (msg === ignoreWarnMessage) return;
};

Vue.config.productionTip = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
Vue.use(Vuesax as any);

Vue.use(ShortKey, {
  prevent: ['input'],
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
