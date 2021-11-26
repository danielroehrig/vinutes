import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import DailyMedia from './lib/DailyMedia'
import * as sc from './store-constants'

Vue.use(Vuex)
const supportedLanguages = ['en', 'de']

const store = new Vuex.Store({
  state: {
    currentDailyMediaShown: null,
    currentMonth: moment().month(),
    currentYear: moment().year(),
    currentDaySelected: null,
    language: 'en',
    calendarTimeStampFormat: 'ddd, D. MMM, Y',
    currentTimeline: null,
    mediaFiles: {},
    appState: sc.APP_STATE_UNKNOWN,
    timelines: [],
    renderCurrentDailyMedia: null,
    renderPercentage: 0
  },
  mutations: {
    setCurrentDailyMedia (state, dailyMedia) {
      state.currentDailyMediaShown = dailyMedia
    },
    setTimeStampForVideo (state, timeStamp) {
      state.currentDailyMediaShown.timeStamp = timeStamp
    },
    moveToPreviousMonth (state) {
      const currentMoment = moment(
        { year: state.currentYear, month: state.currentMonth })
      currentMoment.subtract(1, 'month')
      state.currentMonth = currentMoment.month()
      state.currentYear = currentMoment.year()
    },
    moveToNextMonth (state) {
      console.log('next Month')
      const currentMoment = moment(
        { year: state.currentYear, month: state.currentMonth })
      currentMoment.add(1, 'month')
      if (currentMoment < moment()) {
        state.currentMonth = currentMoment.month()
        state.currentYear = currentMoment.year()
      }
    },
    changeMediaFile (state, dailyMedia) {
      console.log('++++ Change Media File')
      Vue.set(state.mediaFiles, dailyMedia.day, dailyMedia)
    },
    /**
     * Change the language of the ui and timestamps
     *
     * @param {object} state
     * @param {string} language
     */
    changeLanguage (state, language) {
      state.language = language
    },
    /**
     * Change the timestamp format displayed in the calendar
     * @param state
     * @param {string} format
     */
    changeTimestampFormat (state, format) {
      state.calendarTimeStampFormat = format
    },
    changeTimeline (state, timeline) {
      state.currentTimeline = timeline
    },

    /**
     * Load media files for the current month
     * @param state
     */
    loadDailyMedia (state) {
      const startPoint = moment(
        { year: state.currentYear, month: state.currentMonth, day: 1 })
      const endPoint = moment(startPoint).endOf('month')
      const allMedia = window.db.getDailyMediaForTimelineAndRange(state.currentTimeline,
        startPoint.format('YYYY-MM-DD'), endPoint.format('YYYY-MM-DD'))

      state.mediaFiles = {}
      allMedia.forEach(media => {
        Vue.set(state.mediaFiles, media.day, media)
      })
      window.ipc.findMissingFiles(allMedia, state.currentYear, state.currentMonth)
    },

    applyConfig (state, databaseRow) {
      window.log.debug('System Language: ' + navigator.language)
      if (databaseRow.language) {
        state.language = databaseRow.language
      } else if (supportedLanguages.includes(navigator.language)) {
        state.language = navigator.language
      } else {
        state.language = 'en'
      }
    },
    /**
     * Change the current state of the app
     * @param state
     * @param {string} appState
     */
    changeAppState (state, appState) {
      state.appState = appState
    },
    /**
     * Write the loaded timelines into the store
     * @param state
     * @param timelines
     */
    setTimelines (state, timelines) {
      state.timelines = timelines
    },
    /**
     * Set the currently selected day
     * @param state
     * @param {int} day
     */
    setCurrentDaySelected (state, day) {
      state.currentDaySelected = day
    },
    /**
     * Just clear the calendar
     * @param state
     */
    clearMediafiles (state) {
      state.mediaFiles = {}
    },
    renderUpdate (state, payload) {
      state.renderCurrentDailyMedia = payload.dailyMedia
      state.renderPercentage = payload.percentage
    }
  },
  actions: {
    /**
     * Change the current timeline
     * @param context
     * @param {int} timeline
     */
    changeTimeline (context, timeline) {
      const currentTimeline = window.db.loadTimeline(timeline)
      context.commit('changeTimeline', currentTimeline.id)
      context.commit('loadDailyMedia')
      context.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    },
    acceptVideo (context, timeStamp) {
      context.commit('setTimeStampForVideo', timeStamp)
    },
    /**
     * Load the last state of the app from the database
     * @param context
     */
    loadLastState (context) {
      const lastState = window.db.loadLastState()
      context.commit('applyConfig', lastState)
      if (lastState.currentTimeline) {
        context.dispatch('changeTimeline', lastState.currentTimeline)
      }
    },
    moveToPreviousMonth (context) {
      context.commit('moveToPreviousMonth')
      context.commit('loadDailyMedia')
    },
    moveToNextMonth (context) {
      context.commit('moveToNextMonth')
      context.commit('loadDailyMedia')
    },
    /**
     * Issue the database to delete a media file, then reload
     * TODO: Should not be the responsibility of the store
     * @param context
     */
    removeCurrentMediaFile (context) {
      window.db.deleteMediaFileFromTimeline(context.state.currentTimeline, new DailyMedia(context.state.currentYear, context.state.currentMonth + 1,
        context.state.currentDaySelected, '', '', 0))
      context.commit('loadDailyMedia')
      context.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    },
    /**
     * Delete the current timelines and all videos
     * @param context
     * @return {Promise<void>}
     */
    async deleteCurrentTimeline (context) {
      const currentTimeline = context.state.currentTimeline
      context.commit('changeTimeline', null)
      window.db.deleteTimeline(currentTimeline)
      await context.dispatch('loadTimelines')
      if (context.state.timelines.length > 0) {
        await context.dispatch('changeTimeline', context.state.timelines[0].id)
      } else {
        context.commit('clearMediafiles')
        context.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
      }
    },
    /**
     * Load all timelines from the database
     * @param context
     */
    loadTimelines (context) {
      const timelines = window.db.getAllTimelines()
      context.commit('setTimelines', timelines)
    },

    /**
     * Mark daily medias where the filepath no longer exists as missing
     * @param state
     * @param {DailyMedia[]} missingFiles
     * @param {int} year
     * @param {int} month
     */
    markMissingFiles ({ state }, { missingFiles, year, month }) {
      if (year !== state.currentYear || month !== state.currentMonth) {
        return
      }
      missingFiles.forEach(media => {
        Vue.set(state.mediaFiles, media.day, media)
      })
    }

  },
  getters: {
    timelineNames: state => {
      return state.timelines.map(timeline => timeline.name)
    }
  }
})

export default store
