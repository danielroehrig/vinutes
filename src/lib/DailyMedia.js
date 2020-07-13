import mime from "mime";
import moment from "moment";

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

    get dateAsIso(){
        let moment = moment({year: this.year, month: this.month, day: this.day});
        return moment.format('YYYY-MM-DD');
    }
    /**
     * Set type for this class to DailyMedia
     * @returns {string}
     */
    get [Symbol.toStringTag]() {
        return "DailyMedia";
    }
}

/**
 * Get the file type category for a given Daily Media.
 *
 * @param {DailyMedia} dailyMedia
 *
 * @returns {string} "image" or "video"
 */
export const fileTypeCategory = (dailyMedia) => {
    return mime.getType(dailyMedia.filePath).split("\/")[0];
};

export const dateAsIso = (dailyMedia) => {
    return moment({year: dailyMedia.year, month: dailyMedia.month, day: dailyMedia.day}).format('YYYY-MM-DD');
}