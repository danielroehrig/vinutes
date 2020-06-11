import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";
import DailyMedia from "./lib/DailyMedia";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isVideoPlayerVisible: false,
    currentDate: null,
    currentMonth: moment().month(),
    currentYear:  moment().year(),
    mediaFiles: {},
  },
  mutations: {
    openMediaFileDialog(state) {
      state.isVideoPlayerVisible = !state.isVideoPlayerVisible;
    },
    moveToPreviousMonth(state) {
      console.log("previous month");
      let currentMoment = moment({year: state.currentYear, month: state.currentMonth});
      currentMoment.subtract(1, 'month');
      state.currentMonth = currentMoment.month();
      state.currentYear = currentMoment.year();
    },
    moveToNextMonth(state) {
      let currentMoment = moment({year: state.currentYear, month: state.currentMonth});
      currentMoment.add(1, 'month');
      if(currentMoment < moment()){
        state.currentMonth = currentMoment.month();
        state.currentYear = currentMoment.year();
      }
    },
    changeMediaFile(state, dailyMedia) {
      let dayAsMoment = moment({year: dailyMedia.year, month: dailyMedia.month, day: dailyMedia.day});
      let key = "k"+dayAsMoment.format('YYYYMMDD');
      Vue.set(state.mediaFiles, key, dailyMedia);
    }
  },
  actions: {

  }
})
