import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import {handleStoreMutation, initDBStructure, loadLastState} from "./lib/PersistenceService";
import {loadTimeline} from "./lib/TimelineService";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isVideoPlayerVisible: false,
        currentDailyMediaShown: null,
        currentMonth: moment().month(),
        currentYear: moment().year(),
        language: "en",
        calendarTimeStampFormat: "ddd, D. MMM, Y",
        currentTimeline: null,
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
        setTimeStampForVideo(state, timeStamp) {
            state.currentDailyMediaShown.timeStamp = timeStamp;
        },
        moveToPreviousMonth(state) {
            let currentMoment = moment({year: state.currentYear, month: state.currentMonth});
            currentMoment.subtract(1, "month");
            state.currentMonth = currentMoment.month();
            state.currentYear = currentMoment.year();
        },
        moveToNextMonth(state) {
            let currentMoment = moment({year: state.currentYear, month: state.currentMonth});
            currentMoment.add(1, "month");
            if (currentMoment < moment()) {
                state.currentMonth = currentMoment.month();
                state.currentYear = currentMoment.year();
            }
        },
        changeMediaFile(state, dailyMedia) {
            let dayAsMoment = moment({year: dailyMedia.year, month: dailyMedia.month, day: dailyMedia.day});
            Vue.set(state.mediaFiles, dailyMedia.day, dailyMedia);
        },
        removeMediaFile(state, moment) {
            Vue.delete(state.mediaFiles, "k" + moment.format("YYYYMMDD"));
        },
        /**
         * Change the language of the ui and timestamps
         *
         * @param {object} state
         * @param {string} language
         */
        changeLanguage(state, language) {
            state.language = language;
        },
        /**
         * Change the timestamp format displayed in the calendar
         * @param state
         * @param {string} format
         */
        changeTimestampFormat(state, format) {
            state.calendarTimeStampFormat = format;
        },
        /**
         * Change the current timeline
         * @param state
         * @param {int} timeline
         */
        changeTimeline(state, timeline) {
            console.log("Change Timeline");
            let currentTimeline = loadTimeline(timeline)
            state.currentTimeline = currentTimeline.id;
                //TODO: Load all mediafiles
        },
        applyConfig(state, databaseRow){
            state.language = databaseRow.language ? databaseRow.language : 'en';//TODO: Use system default language
            if(databaseRow.currentTimeline){
                state.currentTimeline = databaseRow.currentTimeline;
                //TODO: Load all mediafiles
            }
        }
    },
    actions: {
        acceptVideo(context, timeStamp) {
            context.commit("setTimeStampForVideo", timeStamp);
            context.commit("hideVideoPlayer");
        },
        /**
         *
         * @param context
         */
        loadLastState(context) {
            let lastState = loadLastState();
            context.commit('applyConfig', lastState);
        },
    },
});
// All changes to the state are relayed to the PersistenceService
store.subscribe(handleStoreMutation);

export default store;
