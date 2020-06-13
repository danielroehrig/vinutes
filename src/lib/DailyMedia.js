import mime from "mime";

export class DailyMedia {
    constructor(year, month, day, filePath) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.filePath = filePath;
    }
}
export function fileType(dailyMedia) {
    return mime.getType(dailyMedia.filePath).split('\/')[0];
}

