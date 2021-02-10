import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import store from './store'
import './../css/vinutes.css'
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

ipcRenderer.on('render-update', (event, previewImageFilePath, percentage) => {
  console.log('render update! ' + percentage)
  console.log('file image! ' + previewImageFilePath)
  store.commit('changeAppState', sc.APP_STATE_RENDERING_TIMELINE)
  store.commit('renderUpdate', { imagePath: previewImageFilePath || null, percentage: percentage })
})

ipcRenderer.on('render-done', event => {
  store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
})
