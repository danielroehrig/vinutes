import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import DailyMedia from './lib/DailyMedia'
import { handleStoreMutation, loadLastState } from '@/lib/PersistenceService'
import * as sc from './store-constants'
import { getAllTimelines, loadDailyMediaForTimeline, loadTimeline, deleteMediaFileFromTimeline } from '@/lib/TimelineService'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isVideoPlayerVisible: false,
    currentDailyMediaShown: null,
    currentMonth: moment().month(),
    currentYear: moment().year(),
    currentDaySelected: null,
    language: 'en',
    calendarTimeStampFormat: 'ddd, D. MMM, Y',
    currentTimeline: null,
    mediaFiles: {},
    renderQueue: [],
    renderedQueue: [],
    renderOutputPath: null,
    appState: sc.APP_STATE_UNKNOWN,
    timelines: []
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
      const currentMoment = moment(
        { year: state.currentYear, month: state.currentMonth })
      currentMoment.add(1, 'month')
      if (currentMoment < moment()) {
        state.currentMonth = currentMoment.month()
        state.currentYear = currentMoment.year()
      }
    },
    changeMediaFile (state, dailyMedia) {
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
    loadDailyMedia (state) {
      const startPoint = moment(
        { year: state.currentYear, month: state.currentMonth, day: 1 })
      const endPoint = moment(startPoint).endOf('month')
      const allMedia = loadDailyMediaForTimeline(state.currentTimeline,
        startPoint.format('YYYY-MM-DD'), endPoint.format('YYYY-MM-DD'))
      state.mediaFiles = {}
      allMedia.forEach((row) => {
        const mediaMoment = moment(row.mediaDate)
        Vue.set(state.mediaFiles, mediaMoment.date(),
          new DailyMedia(mediaMoment.year(), mediaMoment.month(),
            mediaMoment.date(), row.path, row.mediaType, row.videoTimestamp,
            row.videoStill))
      })
    },
    applyConfig (state, databaseRow) {
      state.language = databaseRow.language ? databaseRow.language : 'en'// TODO: Use system default language
    },
    clearRenderQueues (state) {
      state.renderQueue = []
      state.renderedQueue = []
    },
    setRenderOutputPath (state, path) {
      state.renderOutputPath = path
    },
    setRenderQueue (state, elements) {
      state.renderQueue = elements
    },
    addToRenderedQueue (state, element) {
      state.renderedQueue.push(element)
    },
    removeFirstElementFromRenderQueue (state) {
      state.renderQueue.shift()
    },
    /**
     * Change the current state of the app
     * @param state
     * @param {int} appState
     */
    changeAppState (state, appState) {
      state.appState = appState
    },
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
    }
  },
  actions: {
    /**
     * Change the current timeline
     * @param context
     * @param {int} timeline
     */
    changeTimeline (context, timeline) {
      console.log('Change Timeline')
      const currentTimeline = loadTimeline(timeline)
      context.commit('changeTimeline', currentTimeline.id)
      context.commit('loadDailyMedia')
      context.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    },
    acceptVideo (context, timeStamp) {
      context.commit('setTimeStampForVideo', timeStamp)
    },
    /**
     *
     * @param context
     */
    loadLastState (context) {
      const lastState = loadLastState()
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
    startRenderQueue (context, dailyMediaObjects) {
      context.commit('clearRenderQueues')
      context.commit('setRenderQueue', dailyMediaObjects)
      context.dispatch('renderNextInQueue', null)
    },
    renderNextInQueue (context, lastElement) {
      if (lastElement !== null) {
        context.commit('addToRenderedQueue', lastElement)
      }
      if (context.state.renderQueue.length > 0) {
        const nextElement = context.state.renderQueue[0]
        context.commit('removeFirstElementFromRenderQueue')
        ipcRenderer.send('render-video', nextElement)
      } else {
        const mediaFilePaths = context.state.renderedQueue.map((mediaFile) => {
          return mediaFile.tmpFilePath
        })
        ipcRenderer.send('merge-videos', mediaFilePaths,
          context.state.renderOutputPath)
      }
    },
    /**
     * Event: Day in calendar view was clicked.
     * @param context
     * @param {int} day
     */
    calendarDayClicked (context, day) {
      if (context.state.currentTimeline === null) {
        context.commit('changeAppState', sc.APP_STATE_CREATE_TIMELINE)
        return
      }
      context.commit('setCurrentDaySelected', day)
      context.commit('changeAppState', sc.APP_STATE_CHOOSE_MEDIA_FILE)
    },
    /**
     * Issue the database to delete a media file, then reload
     * @param context
     * @param day
     */
    removeMediaFile (context, day) {
      deleteMediaFileFromTimeline(context.state.currentTimeline, new DailyMedia(context.state.currentYear, context.state.currentMonth + 1,
        day, '', ''))
      context.commit('loadDailyMedia')
    },
    /**
     * Load all timelines from the database
     * @param context
     */
    loadTimelines (context) {
      const timelines = getAllTimelines()
      context.commit('setTimelines', timelines)
    }
  },
  getters: {
    timelineNames: state => {
      return state.timelines.map(timeline => timeline.name)
    }
  }
})
// All changes to the state are relayed to the PersistenceService
store.subscribe(handleStoreMutation)
ipcRenderer.on('screenshot-created', (event, dailyMedia) => {
  store.commit('changeMediaFile', dailyMedia)
})
ipcRenderer.on('video-rendered', (event, dailyMedia) => {
  console.log('Store says, render next!')
  store.dispatch('renderNextInQueue', dailyMedia)
})
ipcRenderer.on('video-merged', (event, dailyMedia) => {
  console.log('Store says, everything is merged!')
  store.commit('setRenderOutputPath', null)
  store.commit('clearRenderQueues')
})
export default store
