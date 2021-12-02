import path from 'path'
import {
  handleStoreMutation,
  initDBStructure,
  loadLastState, migrate
} from '@/lib/PersistenceService'
import {
  createNewTimeline,
  deleteMediaFileFromTimeline, deleteTimeline,
  getAllTimelines, getDailyMediaForTimeline,
  getDailyMediaForTimelineAndRange,
  loadTimeline, safeDailyMediaForTimeline
} from '@/lib/TimelineService'
const { contextBridge, ipcRenderer } = require('electron')

const userPath = ipcRenderer.sendSync('get-user-path')
let dbPath = path.join(userPath, 'vinutes.db')
if (process.env.WEBPACK_DEV_SERVER_URL) {
  dbPath = path.join(userPath, 'vinutes-dev.db')
}
const Database = require('better-sqlite3')
const db = new Database(dbPath, { verbose: console.log })

const log = require('electron-log')

// We need require to run our tests
if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require
}
contextBridge.exposeInMainWorld('db', {
  initDBStructure: () => initDBStructure(db),
  migrate: () => migrate(db),
  getAllTimelines: () => getAllTimelines(db),
  loadLastState: () => loadLastState(db),
  loadTimeline: (timeline) => loadTimeline(db, timeline),
  handleStoreMutation: (mutation, state) => handleStoreMutation(db, mutation, state),
  getDailyMediaForTimelineAndRange: (timelineId, startDate, endDate) => getDailyMediaForTimelineAndRange(db, timelineId, startDate, endDate),
  getDailyMediaForTimeline: (timelineId) => getDailyMediaForTimeline(db, timelineId),
  deleteMediaFileFromTimeline: (timelineId, dailyMedia) => deleteMediaFileFromTimeline(db, timelineId, dailyMedia),
  deleteTimeline: (timelineId) => deleteTimeline(db, timelineId),
  createNewTimeline: (name) => createNewTimeline(db, name),
  safeDailyMediaForTimeline: (timelineId, dailyMedia) => safeDailyMediaForTimeline(db, timelineId, dailyMedia)
})

contextBridge.exposeInMainWorld('log', {
  debug: (message) => log.debug(message)
})

contextBridge.exposeInMainWorld('ipc', {
  receive: (channel, func) => {
    ipcRenderer.on(channel, func)
  },
  findMissingFiles: (allMedia, currentYear, currentMonth) => ipcRenderer.send('find-missing-files', allMedia, currentYear, currentMonth),
  showOpenDialog: (currentYear, oneBasedMonthNumeral, currentDaySelected) => ipcRenderer.sendSync('show-open-dialog', currentYear, oneBasedMonthNumeral, currentDaySelected),
  showSaveDialog: () => ipcRenderer.sendSync('show-save-dialog'),
  renderImagePreview: (dailyMedia) => ipcRenderer.send('render-image-preview', dailyMedia),
  switchLanguage: (language) => ipcRenderer.send('update-config', 'language', language),
  cancelRendering: () => ipcRenderer.send('cancel-rendering'),
  startRendering: (filePath, mediaFiles) => ipcRenderer.send('start-rendering', filePath, mediaFiles),
  getMediaType: (filePath) => ipcRenderer.sendSync('get-media-type', filePath),
  createVideoScreenshot: (currentDailyMedia, currentTimeline) => ipcRenderer.send('create-video-screenshot', currentDailyMedia, currentTimeline)
})
