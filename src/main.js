// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import moment from 'moment'
import VeeValidate, { Validator } from 'vee-validate'
import router from './router'
import VueCookies from 'vue-cookies'

Validator.installDateTimeValidators(moment)
Vue.use(VeeValidate)
Vue.use(VueCookies)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
