import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/preferences',
      name: 'preferences',
      component: function () {
        return import(/* webpackChunkName: "preferences" */ './views/Preferences.vue')
      }
    },
    {
      path: '/',
      name: 'calendar',
      component: function () {
        return import(/* webpackChunkName: "calendar" */ './views/Calendar.vue')
      }
    }
  ]
})
