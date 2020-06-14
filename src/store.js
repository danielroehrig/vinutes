import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";
import DailyMedia from "./lib/DailyMedia";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isVideoPlayerVisible: false,
    currentDailyMediaShown: null,
    currentMonth: moment().month(),
    currentYear:  moment().year(),
    mediaFiles: {},
  },
  mutations: {
    showVideoPlayer(state, dailyMedia) {
      state.currentDailyMediaShown = dailyMedia;
      state.isVideoPlayerVisible = true;
    },
    hideVideoPlayer(state) {
      state.currentDailyMediaShown = null;
      state.isVideoPlayerVisible = false;
    },
    setTimeStampForVideo(state, timeStamp){
      state.currentDailyMediaShown.timeStamp = timeStamp;
      console.log(state.mediaFiles);
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
    },
    removeMediaFile(state, moment){
      Vue.delete(state.mediaFiles, "k"+moment.format('YYYYMMDD'));
    }
  },
  actions: {

  }
})
