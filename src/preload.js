import {ipcRenderer} from "electron";
import path from "path";

const userPath = ipcRenderer.sendSync('get-user-path');
const dbPath = path.join(userPath, "justasec.db");
const Database = require('better-sqlite3');
const db = new Database(dbPath, { verbose: console.log });

if (process.env.NODE_ENV === 'test') {
    window.electronRequire = require
}

// Expose these functions and variables to the renderer thread
window.ipcRenderer = ipcRenderer;
window.db = db;