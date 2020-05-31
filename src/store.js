import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isVideoPlayerVisible: false
  },
  mutations: {
    toggleVideoPlayerVisibility(state) {
      state.isVideoPlayerVisible = !state.isVideoPlayerVisible;
    }
  },
  actions: {

  }
})
