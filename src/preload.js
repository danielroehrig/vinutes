import { ipcRenderer } from 'electron'
import path from 'path'

const userPath = ipcRenderer.sendSync('get-user-path')
let dbPath = path.join(userPath, 'vinutes.db')
if (process.env.WEBPACK_DEV_SERVER_URL) {
  dbPath = path.join(userPath, 'vinutes-dev.db')
}
const Database = require('better-sqlite3')
const db = new Database(dbPath, { verbose: console.log })

// We need require to run our tests
if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require
}

// Expose these functions and variables to the renderer thread
window.ipcRenderer = ipcRenderer
window.db = db
