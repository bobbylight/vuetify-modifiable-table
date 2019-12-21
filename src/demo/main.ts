import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import App from './app.vue';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h: any) => h(App)
} as any).$mount('#app');
