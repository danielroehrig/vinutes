const mime = require("mime");

/**
 * Class for a medium for one day
 */
class DailyMedia {
    /**
     *
     * @param {int} year Four digit representation of the year
     * @param {int} month
     * @param {int} day
     * @param {string} filePath Full path to file
     * @param {number} timeStamp
     * @param {?string} screenshotPath
     */
    constructor(year, month, day, filePath, timeStamp = 0.0, screenshotPath = null) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.filePath = filePath;
        this.timeStamp = 0.0;
        this.screenshotPath = null;
    }

    /**
     * Set type for this class to DailyMedia
     * @returns {string}
     */
    get [Symbol.toStringTag]() {
        return "DailyMedia";
    }

    /**
     * Create a new DailyMedia from json object
     * @param data
     * @returns {DailyMedia}
     */
    static from(data){
        return new DailyMedia(data.year, data.month, data.day, data.filePath);
    }
}

/**
 * Get the file type category for a given Daily Media.
 *
 * @param {DailyMedia} dailyMedia
 *
 * @returns {string} "image" or "video"
 */
const fileTypeCategory = (dailyMedia) => {
    return mime.getType(dailyMedia.filePath).split("\/")[0];
}

module.exports.DailyMedia = DailyMedia;
module.exports.fileTypeCategory = fileTypeCategory;