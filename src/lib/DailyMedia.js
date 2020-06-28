const mime = require("mime");

const dailyMediaSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "DailyMedia",
    "description": "A media file for a certain date in the calendar",
    "type": "object",
    "properties": {
        "year": {
            "description": "The year for the media file",
            "type": "integer",
        },
        "month": {
            "description": "The month for the media file",
            "type": "integer",
        },
        "day": {
            "description": "The month for the media file",
            "type": "integer",
        },
        "filePath": {
            "description": "The file path of the media file",
            "type": "string",
            "minLength": 2,
        },
        "timeStamp": {
            "description": "The starting point of the media file (if it is a video)",
            "type": "number",
            "minimum": 0.0
        },
        "screenshotPath": {
            "description": "The path to an existing screenshot of the media file (if it is a video)",
            "type": "string",
            "minLength": 2,
        },
    },
    "required": ["year", "month", "day", "filePath"],
};
const Ajv = require("ajv");
const ajv = new Ajv();
const jsonValidate = ajv.compile(dailyMediaSchema);

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
    static from(data) {
        let isDataValid = jsonValidate(data);
        if (!isDataValid) {
            throw new Error(ajv.errorsText(jsonValidate.errors));
        }
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
};

module.exports.DailyMedia = DailyMedia;
module.exports.fileTypeCategory = fileTypeCategory;