import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { de } from './locales/de'
import { en } from './locales/en'
Vue.use(VueI18n)

function loadLocaleMessages () {
  return {
    de: de,
    en: en
  }
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})
