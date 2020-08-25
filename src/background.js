'use strict'
import { app, protocol, BrowserWindow, dialog } from 'electron'
import {
  createProtocol
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import DailyMedia, { fileTypeCategory } from './lib/DailyMedia'

const isDevelopment = process.env.NODE_ENV !== 'production'
const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const log = require('electron-log')
const VideoRenderer = require('./lib/VideoRenderer')

/** Paths */
const userDataPath = app.getPath('userData')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // TODO: Only when env variable set (debug mode) also delete old logs!
  log.info('Window created')
  // Create the browser window.
  win = new BrowserWindow(
    {
      width: 1024,
      height: 800,
      minWidth: 1024,
      icon: path.join(__static, 'icon.png'),
      webPreferences: {
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false
      }
    })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  const protocolName = 'file'
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, '')
    try {
      return callback(decodeURIComponent(url))
    } catch (error) {
      console.error(error)
    }
  })
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('show-open-dialog', (event, year, month, day) => {
  console.log(`Open File Dialog for ${year} ${month} ${day}`)
  const filePaths = dialog.showOpenDialogSync({
    title: 'Choose a video or image',
    filters: [
      { name: 'All media files', extensions: ['mp4', 'mov', 'avi', 'mpg', 'mpeg', 'jpg', 'jpeg', 'gif', 'png'] },
      { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mpg', 'mpeg'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'gif', 'png'] }
    ],
    properties: ['openFile']
  })
  if (filePaths) {
    const filePath = filePaths[0]
    event.returnValue = new DailyMedia(year, month, day, filePath, fileTypeCategory(filePath))
  } else {
    event.returnValue = null
  }
})

ipcMain.on('show-save-dialog', (event) => {
  const filePath = dialog.showSaveDialogSync({
    title: 'Choose a video or image',
    defaultPath: app.getPath('home')
  })
  if (filePath) {
    event.returnValue = filePath
  } else {
    event.returnValue = null
  }
})

ipcMain.on('create-video-screenshot', (event, dailyMedia, timeline) => {
  console.log(`Create screenshot for ${dailyMedia.filePath}`)
  VideoRenderer.createScreenshot(dailyMedia, timeline, event)
})

ipcMain.on('get-user-path', (event) => {
  event.returnValue = app.getPath('userData')
})

const renderedTempPath = path.join(app.getPath('temp'), 'vinutes-rendered')
ipcMain.on('render-video', (event, dailyMedia) => {
  console.log('start render file')
  try {
    fs.mkdirSync(renderedTempPath)
  } catch (e) {
    console.log('path exists presumably')
  }
  VideoRenderer.renderVideo(dailyMedia, renderedTempPath, event)
})

ipcMain.on('merge-videos', (event, filePaths, outputPath) => {
  console.log('start merging videos to ' + outputPath)
  VideoRenderer.mergeVideos(filePaths, outputPath, event)
})

ipcMain.on('render-image-preview', (event, dailyMedia) => {
  console.log('creating image preview')
  VideoRenderer.createImagePreview(dailyMedia, event)
})

ipcMain.on('exit-app', (event, exitCode) => {
  if (exitCode > 0) {
    log.error('App exited abnormally!')
  } else {
    log.info('App exited normally!')
  }
  app.exit(exitCode)
})
