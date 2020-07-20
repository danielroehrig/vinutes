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
     * @param {string} mediaType
     * @param {number} timeStamp
     * @param {?string} videoStill
     */
    constructor(year, month, day, filePath, mediaType, timeStamp = 0.0, videoStill = null) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.filePath = filePath;
        this.timeStamp = 0.0;
        this.videoStill = videoStill;
        this.mediaType = mediaType;
    }

    get dateAsIso(){
        return dateAsIso(this);
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
 * @param {string} filePath
 *
 * @returns {string} "image" or "video"
 */
export const fileTypeCategory = (filePath) => {
    return mime.getType(filePath).split("\/")[0];
};

export const dateAsIso = (dailyMedia) => {
    return moment({year: dailyMedia.year, month: dailyMedia.month, day: dailyMedia.day}).format('YYYY-MM-DD');
}