import DailyMedia, { dateAsIso, fileTypeCategory } from './DailyMedia'

import moment from 'moment'

export const loadTimeline = (id) => {
  console.log(`Loading timeline ${id}`)
  return db.prepare('SELECT * FROM timeline WHERE id=$id;').get({ id: id })
}

export const getAllTimelines = () => {
  console.log('Get all timelines')
  return db.prepare('SELECT * FROM timeline ORDER BY name ASC;').all()
}

/**
 * Create a new timeline with the given name and return the id.
 * @param {string} name
 * @return {int}
 * @throws SqliteError
 */
export const createNewTimeline = (name) => {
  // TODO: Handle Exceptions like non-unique names
  const insertResult = db.prepare('INSERT INTO timeline (name) VALUES ($name);').run({ name: name })
  return insertResult.lastInsertRowid
}

export const loadDailyMediaForTimeline = (id, startDate, endDate) => {
  return db.prepare('SELECT m.*, vS.data AS videoStill FROM media AS m LEFT JOIN videoStills vS ON m.timelineId = vS.timelineId AND m.mediaDate = vS.mediaDate WHERE m.timelineId=$id AND m.mediaDate >= $startDate AND m.mediaDate <= $endDate;').all({
    id: id,
    startDate: startDate,
    endDate: endDate
  })
}

/**
 * Get all daily medias for a timeline
 * @param {int} timelineId
 * @returns {array} DailyMedia
 */
export const getDailyMediaForTimeline = (timelineId) => {
  const dbResults = db.prepare('SELECT m.mediaDate, m.path, m.videoTimestamp, m.mediaType, vs.data AS previewImage FROM media m LEFT JOIN videoStills vS on m.timelineId = vS.timelineId and m.mediaDate = vS.mediaDate WHERE m.timelineId=$id ORDER BY m.mediaDate ASC;').all({
    id: timelineId
  })

  return dbResults.map(row => {
    const mediaDate = moment(row.mediaDate)
    return new DailyMedia(mediaDate.year(), mediaDate.month(), mediaDate.date(), row.path, row.mediaType, row.videoTimestamp, row.previewImage)
  })
}

/**
 * Get all daily medias for a timeline and a time range
 * @param {int} timelineId
 * @param {string} startDate
 * @param {string} endDate
 * @returns {array} DailyMedia
 */
export const getDailyMediaForTimelineAndTimeRange = (timelineId, startDate, endDate) => {
  const dbResults = db.prepare('SELECT m.mediaDate, m.path, m.videoTimestamp, m.mediaType, vs.data AS previewImage FROM media m LEFT JOIN videoStills vS on m.timelineId = vS.timelineId and m.mediaDate = vS.mediaDate WHERE m.timelineId=$id AND m.mediaDate BETWEEN $startDate AND $endDate ORDER BY m.mediaDate ASC;').all({
    id: timelineId,
    startDate: startDate,
    endDate: endDate
  })
  dbResults.forEach(row => console.log('Timestamp: ' + row.videoTimestamp))

  return dbResults.map(row => {
    const mediaDate = moment(row.mediaDate)
    return new DailyMedia(mediaDate.year(), mediaDate.month(), mediaDate.date(), row.path, row.mediaType, row.videoTimestamp, row.previewImage)
  })
}

export const safeDailyMediaForTimeline = (timelineId, dailyMedia) => {
  console.log('Saving Timeline to database!')
  const replaceDailyMedia = db.transaction(() => {
    db.prepare('INSERT INTO media (timelineId, mediaDate, path, videoTimestamp, mediaType) VALUES ($timelineId, $mediaDate, $path, $videoTimestamp, $mediaType) ON CONFLICT(timelineId, mediaDate) DO UPDATE SET path=$path, videoTimestamp=$videoTimestamp;')
      .run({
        timelineId: timelineId,
        mediaDate: dateAsIso(dailyMedia),
        path: dailyMedia.filePath,
        videoTimestamp: dailyMedia.timeStamp,
        mediaType: fileTypeCategory(dailyMedia.filePath)
      })
    deletePreviewImageFromTimeline(timelineId, dailyMedia)
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
 * @param {int} timelineId
 * @param {DailyMedia} dailyMedia
 */
export const deleteMediaFileFromTimeline = (timelineId, dailyMedia) => {
  console.log('Month ' + dateAsIso(dailyMedia))
  const deleteMediaFile = db.transaction(() => {
    deletePreviewImageFromTimeline(timelineId, dailyMedia)
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
 * @param {int} timelineId
 */
export const deleteTimeline = (timelineId) => {
  console.log('Trying to delete timeline id: ' + timelineId)
  const deleteTimelineTransaction = db.transaction(() => {
    db.prepare('DELETE FROM timeline WHERE id=$timelineId').run({ timelineId: timelineId })
  })
  deleteTimelineTransaction()
}

/**
 * Delete a video still from the given timeline
 * @param {int} timelineId
 * @param {DailyMedia} dailyMedia
 */
const deletePreviewImageFromTimeline = (timelineId, dailyMedia) => {
  db.prepare('DELETE FROM videoStills WHERE timelineId=$timelineId AND mediaDate=$mediaDate;')
    .run({
      timelineId: timelineId,
      mediaDate: dateAsIso(dailyMedia)
    })
}
