import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './../node_modules/bulma/css/bulma.css';

Vue.config.productionTip = false
const fs = require('fs')
const path = require('path')

// Expects myText.txt to be placed in public folder
const fileLocation = path.join(__static, 'silence.mp3')
const fileContents = fs.readFileSync(fileLocation, 'utf8')

var appState = {};

new Vue({
  router,
  store,
  data: appState,
  render: function (h) { return h(App) }
}).$mount('#app')
