// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import VueI18n from 'vue-i18n'
import enUS from './common/i18n/lang/en-US'
import zhCN from './common/i18n/lang/zh-CN'
import './common/interceptor/http-interceptors'
import LoginContext from './common/login-context'
import UniversalPlugin from './common/plugin/universal-plugin'
import DirectivePlugin from './common/plugin/directive-plugin'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.prototype.loginContext = LoginContext

Vue.use(VueI18n)

Vue.use(UniversalPlugin)

Vue.use(DirectivePlugin)

Vue.use(ElementUI)

Vue.filter('formatDate', function (date, frm) {
  return Vue.$formatDate(date, frm)
})

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
