import Vue from 'vue'
import App from './App.vue'
import Buefy, { ToastProgrammatic as Toast } from 'buefy'
import store from './store'
import './../sass/vinutes.scss'
import './../node_modules/@mdi/font/css/materialdesignicons.css'
import i18n from './i18n'
import * as sc from '@/store-constants'

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

ipcRenderer.on('screenshot-created', (event, dailyMedia) => {
  store.commit('changeMediaFile', dailyMedia)
  store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
})

ipcRenderer.on('render-update', (event, dailyMediaObject, percentage) => {
  store.commit('changeAppState', sc.APP_STATE_RENDERING_TIMELINE)
  store.commit('renderUpdate', { dailyMedia: dailyMediaObject || null, percentage: percentage })
})

ipcRenderer.on('render-done', event => {
  store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
  const message = i18n.t('text.render-complete')
  Toast.open({
    message: message,
    type: 'is-primary',
    position: 'is-bottom'
  })
})

ipcRenderer.on('render-cancelled', event => {
  store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
  const message = i18n.t('text.render-cancelled')
  Toast.open({
    message: message,
    type: 'is-danger',
    position: 'is-bottom'
  })
})

ipcRenderer.on('missing-files-found', (event, missingFiles, year, month) => {
  store.dispatch('markMissingFiles', { missingFiles, year, month })
})
