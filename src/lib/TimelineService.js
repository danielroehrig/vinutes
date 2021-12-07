import DailyMedia, { dateAsIso } from './DailyMedia'

import moment from 'moment'
import Timeline from '@/lib/Timeline'

/**
 * Load the timeline metadata
 * @param {Database} db
 * @param {int} id
 * @returns {Timeline}
 */
export const loadTimeline = (db, id) => {
  console.log(`Loading timeline ${id}`)
  const timelineData = db.prepare('SELECT * FROM timeline WHERE id=$id;').get({ id: id })

  return new Timeline(timelineData.name, timelineData.id)
}

/**
 * Get all timeline metadata
 * @param {Database} db
 * @returns {Timeline[]}
 */
export const getAllTimelines = (db) => {
  console.log('Get all timelines')
  const timelineData = db.prepare('SELECT * FROM timeline ORDER BY name ASC;').all()

  return timelineData.map(timeline => new Timeline(timeline.name, timeline.id))
}

/**
 * Create a new timeline with the given name and return the id.
 * @param {Database} db
 * @param {string} name
 * @return {int} Timeline ID
 * @throws SqliteError
 */
export const createNewTimeline = (db, name) => {
  // TODO: Handle Exceptions like non-unique names
  const insertResult = db.prepare('INSERT INTO timeline (name) VALUES ($name);').run({ name: name })
  return insertResult.lastInsertRowid
}

/**
 * Get all Daily Media Files within the given time frame
 * @param {Database} db
 * @param {int} timelineId Timeline id
 * @param {string} startDate in ISO format
 * @param {string} endDate in ISO format
 * @returns {DailyMedia[]}
 */
export const getDailyMediaForTimelineAndRange = (db, timelineId, startDate, endDate) => {
  const rows = db.prepare('SELECT m.*, vS.data AS videoStill FROM media AS m LEFT JOIN videoStills vS ON m.timelineId = vS.timelineId AND m.mediaDate = vS.mediaDate WHERE m.timelineId=$id AND m.mediaDate >= $startDate AND m.mediaDate <= $endDate ORDER BY m.mediaDate ASC;').all({
    id: timelineId,
    startDate: startDate,
    endDate: endDate
  })
  return rows.map(row => {
    const mediaMoment = moment(row.mediaDate)
    return new DailyMedia(mediaMoment.year(), mediaMoment.month(),
      mediaMoment.date(), row.path, row.mediaType, row.rotation, row.videoTimestamp, row.videoStill)
  })
}

/**
 * Get all daily medias for a timeline
 * @param {Database} db
 * @param {int} timelineId
 * @returns {DailyMedia[]}
 */
export const getDailyMediaForTimeline = (db, timelineId) => {
  const dbResults = db.prepare('SELECT m.mediaDate, m.path, m.videoTimestamp, m.mediaType, m.rotation, vs.data AS previewImage FROM media m LEFT JOIN videoStills vS on m.timelineId = vS.timelineId and m.mediaDate = vS.mediaDate WHERE m.timelineId=$id ORDER BY m.mediaDate ASC;').all({
    id: timelineId
  })

  return dbResults.map(row => {
    const mediaDate = moment(row.mediaDate)
    return new DailyMedia(mediaDate.year(), mediaDate.month(), mediaDate.date(), row.path, row.mediaType, row.rotation, row.videoTimestamp, row.previewImage)
  })
}

/**
 * Upsert a DailyMedia into the given timeline
 * @param {Database} db
 * @param {int} timelineId
 * @param {DailyMedia} dailyMedia
 */
export const safeDailyMediaForTimeline = (db, timelineId, dailyMedia) => {
  console.log('Saving Timeline to database!')
  const replaceDailyMedia = db.transaction(() => {
    db.prepare('INSERT INTO media (timelineId, mediaDate, path, videoTimestamp, mediaType, rotation) VALUES ($timelineId, $mediaDate, $path, $videoTimestamp, $mediaType, $rotation) ON CONFLICT(timelineId, mediaDate) DO UPDATE SET path=$path, videoTimestamp=$videoTimestamp;')
      .run({
        timelineId: timelineId,
        mediaDate: dateAsIso(dailyMedia),
        path: dailyMedia.filePath,
        videoTimestamp: dailyMedia.timeStamp,
        mediaType: dailyMedia.mediaType,
        rotation: dailyMedia.rotation
      })
    deletePreviewImageFromTimeline(db, timelineId, dailyMedia)
    if (dailyMedia.previewImage) {
      db.prepare('INSERT INTO videoStills(timelineId, mediaDate, data) VALUES($timelineId, $mediaDate, $data);')
        .run({
          timelineId: timelineId,
          mediaDate: dateAsIso(dailyMedia),
          data: dailyMedia.previewImage
        })
    }
  })
  replaceDailyMedia()
}

/**
 * Delete the currently set mediafile from the given timeline
 * @param {Database} db
 * @param {int} timelineId
 * @param {DailyMedia} dailyMedia
 */
export const deleteMediaFileFromTimeline = (db, timelineId, dailyMedia) => {
  console.log('Month ' + dateAsIso(dailyMedia))
  const deleteMediaFile = db.transaction(() => {
    deletePreviewImageFromTimeline(db, timelineId, dailyMedia)
    db.prepare(
      'DELETE FROM media WHERE timelineId=$timelineId AND mediaDate=$mediaDate;')
      .run({
        timelineId: timelineId,
        mediaDate: dateAsIso(dailyMedia)
      })
  })
  deleteMediaFile()
}

/**
 * Delete a complete timeline with all associated media
 * @param {Database} db
 * @param {int} timelineId
 */
export const deleteTimeline = (db, timelineId) => {
  console.log('Trying to delete timeline id: ' + timelineId)
  const deleteTimelineTransaction = db.transaction(() => {
    db.prepare('DELETE FROM timeline WHERE id=$timelineId').run({ timelineId: timelineId })
  })
  deleteTimelineTransaction()
}

/**
 * Delete a video still from the given timeline
 * @param {Database} db
 * @param {int} timelineId
 * @param {DailyMedia} dailyMedia
 */
const deletePreviewImageFromTimeline = (db, timelineId, dailyMedia) => {
  db.prepare('DELETE FROM videoStills WHERE timelineId=$timelineId AND mediaDate=$mediaDate;')
    .run({
      timelineId: timelineId,
      mediaDate: dateAsIso(dailyMedia)
    })
}
