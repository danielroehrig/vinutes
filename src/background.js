'use strict'
import { app, protocol, BrowserWindow, dialog, shell } from 'electron'
import {
  createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import DailyMedia, { fileTypeCategory } from './lib/DailyMedia'
import { cancelRendering } from '@/lib/VideoRenderer'
import {
  getMediaExtension,
  getMediaHeader, getMediaTypeFromExtension
} from '@/lib/MediumRecognizer'

const isDevelopment = process.env.NODE_ENV !== 'production'
const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const log = require('electron-log')
const VideoRenderer = require('./lib/VideoRenderer')
const os = require('os')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow(
    {
      width: 1048,
      height: 800,
      minWidth: 1048,
      // TODO: Make scalable
      icon: path.join(__static, 'icons', '48x48.png'),
      webPreferences: {
        nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false
      },
      autoHideMenuBar: true
    })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.webContents.on('new-window', function (event, url) {
    event.preventDefault()
    shell.openExternal(url)
  })

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

// Gets the media type (video or image) from the file
ipcMain.on('get-media-type', (event, file) => {
  getMediaHeader(file)
    .then(mediaHeadHexCode => {
      const typeExtension = getMediaExtension(mediaHeadHexCode)
      event.returnValue = getMediaTypeFromExtension(typeExtension)
    })
})

ipcMain.on('show-open-dialog', (event, year, month, day) => {
  console.log(`Open File Dialog for ${year} ${month} ${day}`)
  let filePaths = []
  // Test path. Yes, this seems like the "right" way to do this
  if (process.env.SPECTRON) {
    if (day === 3) {
      filePaths = [path.join(__dirname, '..', 'tests', 'e2e/testvideos/', 'familie.mp4')]
    } else {
      filePaths = [path.join(__dirname, '..', 'tests', 'e2e/testvideos/', 'vacation.mp4')]
    }
  } else {
    filePaths = dialog.showOpenDialogSync({
      title: 'Choose a video or image',
      filters: [
        {
          name: 'All media files',
          extensions: [
            'mp4',
            'mov',
            'avi',
            'mpg',
            'mpeg',
            'jpg',
            'jpeg',
            'png']
        },
        { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mpg', 'mpeg'] },
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png'] }
      ],
      properties: ['openFile']
    })
  }
  if (filePaths) {
    const filePath = filePaths[0]
    event.returnValue = new DailyMedia(year, month, day, filePath, fileTypeCategory(filePath))
  } else {
    event.returnValue = null
  }
})

ipcMain.on('show-save-dialog', (event) => {
  // Again, testing is weird in electron
  if (process.env.SPECTRON) {
    event.returnValue = path.join(os.tmpdir(), 'spectronoutput.mp4')
    return
  }
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

ipcMain.on('start-rendering', (event, filePath, mediaFiles) => {
  const renderedTempPath = path.join(app.getPath('temp'), 'vinutes-rendered')
  console.log('start rendering files')
  try {
    fs.mkdirSync(renderedTempPath)
  } catch (e) {
    console.log('path exists presumably')
  }
  VideoRenderer
    .run(filePath, mediaFiles, renderedTempPath, event)
    .then(
      () => {
        event.reply('render-done')
        console.log('rendering done')
      }
    )
    .catch(error => {
      event.reply('render-cancelled', error)
    })
})

ipcMain.on('cancel-rendering', (event) => {
  cancelRendering()
})

ipcMain.on('render-image-preview', async (event, dailyMedia) => {
  console.log('creating image preview')
  await VideoRenderer.createImagePreview(dailyMedia, event)
})

ipcMain.on('exit-app', (event, exitCode) => {
  if (exitCode > 0) {
    log.error('App exited abnormally!')
  }
  app.exit(exitCode)
})
