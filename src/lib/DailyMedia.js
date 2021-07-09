import moment from 'moment'

/**
 * Class for a medium for one day
 */
export default class DailyMedia {
  /**
   *
   * @param {int} year Four digit representation of the year
   * @param {int} month
   * @param {int} day
   * @param {string} filePath Full path to file
   * @param {string} mediaType
   * @param {number} timeStamp
   * @param {?string} previewImage
   */
  constructor (
    year, month, day, filePath, mediaType, timeStamp = 0.0, previewImage = null) {
    this.year = year
    this.month = month
    this.day = day
    this.filePath = filePath
    this.timeStamp = timeStamp
    this.previewImage = previewImage
    this.mediaType = mediaType
  }

  get dateAsIso () {
    return dateAsIso(this)
  }

  get dateAsMoment () {
    return dateAsMoment(this)
  }

  /**
   * Set type for this class to DailyMedia
   * @returns {string}
   */
  get [Symbol.toStringTag] () {
    return 'DailyMedia'
  }
}

/**
 * Return date as iso string
 * @param {DailyMedia} dailyMedia
 * @returns {string}
 */
export const dateAsIso = (dailyMedia) => {
  return dateAsMoment(dailyMedia).format('YYYY-MM-DD')
}

/**
 * Return date as moment string
 * @param {DailyMedia} dailyMedia
 * @returns {moment.Moment}
 */
export const dateAsMoment = (dailyMedia) => {
  return moment({
    year: dailyMedia.year,
    month: dailyMedia.month - 1,
    day: dailyMedia.day
  })
}
