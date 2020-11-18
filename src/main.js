import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import store from './store'
import './../css/vinutes.css'
import './../node_modules/@mdi/font/css/materialdesignicons.css'
import i18n from './i18n'

Vue.use(Buefy)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: function (h) { return h(App) }
}).$mount('#app')
