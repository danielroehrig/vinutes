/**
 * Checks media files for existence
 */

const fs = require('fs')
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
  const missingFileResults = await Promise.all(missingFilePromises)
  return dailyMediaObjects.filter((value, index) => {
    return !missingFileResults[index]
  })
}

module.exports.getMissingFiles = getMissingFiles
