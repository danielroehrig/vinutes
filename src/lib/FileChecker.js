/**
 * Checks media files for existence
 */

const fs = require('fs')
const dayjs = require('dayjs')
const fspromises = fs.promises

/**
 * Filter all files that can not be accessed by the filesystem
 * @param dailyMediaObjects
 * @returns {Promise<DailyMedia[]>}
 */
const getMissingFiles = async function (dailyMediaObjects) {
  const missingFilePromises = dailyMediaObjects.map(obj => {
    return fspromises.stat(obj.filePath).then(stat => true).catch(e => false)
  })
  const fileCheckResults = await Promise.all(missingFilePromises)
  const missingFiles = dailyMediaObjects.filter((value, index) => {
    return !fileCheckResults[index]
  })
  missingFiles.sort((a, b) => {
    const aday = dayjs(new Date(a.year, a.month, a.day))
    const bday = dayjs(new Date(b.year, b.month, b.day))
    if (aday.isBefore(bday)) {
      return -1
    }
    if (aday.isAfter(bday)) {
      return 1
    }
    return 0
  })
  return missingFiles
}

module.exports.getMissingFiles = getMissingFiles
