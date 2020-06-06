import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isVideoPlayerVisible: false,
    currentDate: null,
    currentMonth: moment().month(),
    currentYear:  moment().year(),
  },
  mutations: {
    openMediaFileDialog(state) {
      state.isVideoPlayerVisible = !state.isVideoPlayerVisible;
    },
    moveToPreviousMonth(state) {
      let currentMoment = moment({year: state.currentYear, month: state.currentMonth});
      currentMoment.subtract(1, 'month');
      state.currentMonth = currentMoment.month();
      state.currentYear = currentMoment.year();
    },
    moveToNextMonth(state) {
      let currentMoment = moment({year: state.currentYear, month: state.currentMonth});
      currentMoment.add(1, 'month');
      state.currentMonth = currentMoment.month();
      state.currentYear = currentMoment.year();
    }
  },
  actions: {

  }
})
