/**
 * Set up initial database structure and tables.
 * TODO: Think about migrations.
 */
import { safeDailyMediaForTimeline } from './TimelineService'

// TODO: This mus run in main thread before any window is created!
export const initDBStructure = () => {
  db.pragma('foreign_keys = ON')
  db.prepare('CREATE TABLE IF NOT EXISTS timeline (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);').run()
  db.prepare('CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY, language TEXT, currentTimeline INTEGER, FOREIGN KEY(currentTimeline) REFERENCES timeline (id));').run()
  db.prepare('INSERT INTO state(id, language, currentTimeline) VALUES(1, null, null) ON CONFLICT(id) DO NOTHING').run()
  db.prepare("CREATE TABLE IF NOT EXISTS media (timelineId INTEGER NOT NULL, mediaDate TEXT NOT NULL, path TEXT NOT NULL, videoTimestamp REAL, mediaType TEXT CHECK(mediaType IN ('video', 'image')) NOT NULL, FOREIGN KEY(timelineId) REFERENCES timeline (id) ON DELETE CASCADE, PRIMARY KEY(timelineId, mediaDate));").run()
  db.prepare('CREATE TABLE IF NOT EXISTS videoStills (timelineId INTEGER NOT NULL, mediaDate TEXT NOT NULL, data TEXT NOT NULL, FOREIGN KEY(timelineId, mediaDate) REFERENCES media ON DELETE CASCADE, PRIMARY KEY(timelineId, mediaDate));').run()
}

/**
 * Load the last (and only) state from the database (with id 1)
 * @returns {object} The row with the last state
 */
export const loadLastState = () => {
  console.log('Loading last State')
  return db.prepare('SELECT * FROM state WHERE id = 1;').get()
}

/**
 * Handle a store mutation.
 * @param {object} mutation
 * @param {object} state
 * TODO: Make non-blocking somehow
 */
export const handleStoreMutation = (mutation, state) => {
  let updateStatement
  switch (mutation.type) {
    case 'changeLanguage':
      updateStatement = db.prepare('UPDATE state set language=$payload;')
      break
    case 'changeTimeline':
      updateStatement = db.prepare('UPDATE state set currentTimeline=$payload;')
      break
    case 'changeMediaFile':
      safeDailyMediaForTimeline(state.currentTimeline, mutation.payload)
      return
    default:
      console.log('Unknown mutation: ' + mutation.type)
      return
  }
  updateStatement.run({ payload: mutation.payload })
}
