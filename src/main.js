import Vue from 'vue';
import App from './App.vue';
import { Table } from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import {ButterflyVue} from 'butterfly-vue';


Vue.config.productionTip = false
Vue.use(Table, {locale});
Vue.use(ButterflyVue);

// eslint-disable-next-line no-new
new Vue({
  render: h => h(App),
}).$mount('#app')
