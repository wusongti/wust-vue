// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import './common/interceptor/http-interceptors'
import LoginContext from  './common/login-context'
import UniversalPlugin from  './common/plugin/universal-plugin'
import DirectivePlugin from  './common/plugin/directive-plugin'

Vue.config.productionTip = false;

Vue.prototype.loginContext = LoginContext;

Vue.use(UniversalPlugin);

Vue.use(DirectivePlugin);

Vue.filter('formatDate', function (date,frm) {
  return Vue.$formatDate(date,frm);
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
