import {ipcRenderer} from "electron";
const {app} = require("electron").remote;
import path from "path";
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.join(app.getPath("userData"), "justasec.db"));

// Expose these functions and variables to the renderer thread
window.ipcRenderer = ipcRenderer;
window.db = db;