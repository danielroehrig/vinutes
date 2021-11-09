import Vue from 'vue'
import App from './App.vue'
import Buefy, { ToastProgrammatic as Toast } from 'buefy'
import store from './store'
import './../sass/vinutes.scss'
import './../node_modules/@mdi/font/css/materialdesignicons.css'
import i18n from './i18n'
import * as sc from '@/store-constants'

// All changes to the state are relayed to the PersistenceService
store.subscribe(window.db.handleStoreMutation)

Vue.use(Buefy)
Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: function (h) { return h(App) }
}).$mount('#app')

/**
 * #################################################
 * Listeners to various events from the main thread
 * #################################################
 */

window.ipc.receive('screenshot-created', (event, dailyMedia) => {
  store.commit('changeMediaFile', dailyMedia)
  store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
})

window.ipc.receive('render-update', (event, dailyMediaObject, percentage) => {
  store.commit('changeAppState', sc.APP_STATE_RENDERING_TIMELINE)
  store.commit('renderUpdate', { dailyMedia: dailyMediaObject || null, percentage: percentage })
})

window.ipc.receive('render-done', event => {
  store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
  const message = i18n.t('text.render-complete')
  Toast.open({
    message: message,
    type: 'is-primary',
    position: 'is-bottom'
  })
})

window.ipc.receive('render-cancelled', event => {
  store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
  const message = i18n.t('text.render-cancelled')
  Toast.open({
    message: message,
    type: 'is-danger',
    position: 'is-bottom'
  })
})

window.ipc.receive('missing-files-found', (event, missingFiles, year, month) => {
  store.dispatch('markMissingFiles', { missingFiles, year, month })
})
