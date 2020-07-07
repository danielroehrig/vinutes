import {ipcRenderer} from "electron";
const {app} = require("electron").remote;
import path from "path";
const dbPath = path.join(app.getPath("userData"), "justasec.db");
const Database = require('better-sqlite3');
const db = new Database(dbPath, { verbose: console.log });

// Expose these functions and variables to the renderer thread
window.ipcRenderer = ipcRenderer;
window.db = db;