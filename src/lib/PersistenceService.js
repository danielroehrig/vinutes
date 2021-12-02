/**
 * Set up initial database structure and tables.
 */

import { safeDailyMediaForTimeline } from './TimelineService'
import dayjs from 'dayjs'

const path = require('path')
const log = require('electron-log')
const fs = require('fs')

// TODO: This must run in main thread before any window is created!
/**
 * Initializes the first db structure
 * @param db
 */
export const initDBStructure = (db) => {
  db.pragma('foreign_keys = ON')
  db.prepare('CREATE TABLE IF NOT EXISTS timeline (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);').run()
  db.prepare('CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY, language TEXT, currentTimeline INTEGER, FOREIGN KEY(currentTimeline) REFERENCES timeline (id));').run()
  db.prepare('INSERT INTO state(id, language, currentTimeline) VALUES(1, null, null) ON CONFLICT(id) DO NOTHING').run()
  db.prepare("CREATE TABLE IF NOT EXISTS media (timelineId INTEGER NOT NULL, mediaDate TEXT NOT NULL, path TEXT NOT NULL, videoTimestamp REAL, mediaType TEXT CHECK(mediaType IN ('video', 'image')) NOT NULL, FOREIGN KEY(timelineId) REFERENCES timeline (id) ON DELETE CASCADE, PRIMARY KEY(timelineId, mediaDate));").run()
  db.prepare('CREATE TABLE IF NOT EXISTS videoStills (timelineId INTEGER NOT NULL, mediaDate TEXT NOT NULL, data TEXT NOT NULL, FOREIGN KEY(timelineId, mediaDate) REFERENCES media ON DELETE CASCADE, PRIMARY KEY(timelineId, mediaDate));').run()
}

/**
 * Migrate the database to a new version if necessary
 * @param db
 * @returns {Promise<*>}
 */
export const migrate = (db) => {
  const fieldMigrationVersionExists = db.prepare("SELECT COUNT(*) AS fieldExists FROM pragma_table_info('state') WHERE name='migrationVersion'").get()
  let migrationVersion = 0
  if (fieldMigrationVersionExists.fieldExists === 1) {
    const dbMigrationVersion = db.prepare('SELECT migrationVersion FROM state WHERE id = 1;').get()
    migrationVersion = dbMigrationVersion.migrationVersion
  }
  if (migrationVersion === 1) {
    return
  }
  try {
    backupDatabase(db)
  } catch (err) {
    log.error('Could not backup database but migration necessary. I better stop now: ' + err)
  }
}

/**
 *
 * @param db
 * @returns {void}
 */
const backupDatabase = (db) => {
  const dbPath = path.dirname(db.name)
  const dbBackupPath = dbPath + '/' + dayjs().format('YYYYMMDDHHmmss') + '-backup-' + path.basename(db.name)
  return fs.copyFileSync(db.name, dbBackupPath, fs.constants.COPYFILE_EXCL)
}

/**
 * Load the last (and only) state from the database (with id 1)
 * @returns {object} The row with the last state
 */
export const loadLastState = (db) => {
  console.log('Loading last State')
  return db.prepare('SELECT * FROM state WHERE id = 1;').get()
}

/**
 * Handle a store mutation.
 * @param {Database} db
 * @param {object} mutation
 * @param {object} state
 * TODO: Make non-blocking somehow
 */
export const handleStoreMutation = (db, mutation, state) => {
  let updateStatement
  switch (mutation.type) {
    case 'changeLanguage':
      updateStatement = db.prepare('UPDATE state set language=$payload;')
      break
    case 'changeTimeline':
      updateStatement = db.prepare('UPDATE state set currentTimeline=$payload;')
      break
    case 'changeMediaFile':
      safeDailyMediaForTimeline(db, state.currentTimeline, mutation.payload)
      return
    default:
      console.log('Unknown mutation: ' + mutation.type)
      return
  }
  updateStatement.run({ payload: mutation.payload })
}
