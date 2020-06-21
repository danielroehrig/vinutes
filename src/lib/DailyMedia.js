import mime from "mime";

/**
 * Class for a medium for one day
 */
export class DailyMedia {
    /**
     *
     * @param {int} year Four digit representation of the year
     * @param {int} month
     * @param {int} day
     * @param {string} filePath Full path to file
     */
    constructor(year, month, day, filePath) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.filePath = filePath;
        this.timeStamp = 0.0;
        this.screenshotPath = null;
    }
}

/**
 * Get the file type category for a given Daily Media.
 *
 * @param {DailyMedia} dailyMedia
 *
 * @returns {string} "image" or "video"
 */
export function fileTypeCategory(dailyMedia) {
    return mime.getType(dailyMedia.filePath).split('\/')[0];
}

