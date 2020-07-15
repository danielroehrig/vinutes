import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import DailyMedia from "./lib/DailyMedia";
import {handleStoreMutation, loadLastState} from "./lib/PersistenceService";
import {loadDailyMediaForTimeline, loadTimeline} from "./lib/TimelineService";

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
        changeTimeline(state, timeline) {
            state.currentTimeline = timeline;
        },
        loadDailyMedia(state) {
            let startPoint = moment({year: state.currentYear, month: state.currentMonth, day: 1});
            let endPoint = moment(startPoint).endOf("month");
            let allMedia = loadDailyMediaForTimeline(state.currentTimeline, startPoint.format("YYYY-MM-DD"), endPoint.format("YYYY-MM-DD"));
            state.mediaFiles = {};
            allMedia.forEach((row) => {
                let mediaMoment = moment(row.mediaDate);
                Vue.set(state.mediaFiles, mediaMoment.date(), new DailyMedia(mediaMoment.year, mediaMoment.month(), mediaMoment.date(), row.path, row.videoTimestamp, row.videoStill));
            });
        },
        applyConfig(state, databaseRow) {
            state.language = databaseRow.language ? databaseRow.language : "en";//TODO: Use system default language

        },
    },
    actions: {
        /**
         * Change the current timeline
         * @param context
         * @param {int} timeline
         */
        changeTimeline(context, timeline) {
            console.log("Change Timeline");
            let currentTimeline = loadTimeline(timeline);
            context.commit("changeTimeline", currentTimeline.id);
            context.commit("loadDailyMedia");
        },
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
            context.commit("applyConfig", lastState);
            if (lastState.currentTimeline) {
                context.dispatch("changeTimeline", lastState.currentTimeline);
            }
        },
        moveToPreviousMonth(context) {
            context.commit('moveToPreviousMonth');
            context.commit("loadDailyMedia");
        },
        moveToNextMonth(context) {
            context.commit('moveToNextMonth');
            context.commit("loadDailyMedia");
        },
    },
});
// All changes to the state are relayed to the PersistenceService
store.subscribe(handleStoreMutation);

export default store;
