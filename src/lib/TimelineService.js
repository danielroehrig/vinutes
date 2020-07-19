import {dateAsIso, fileTypeCategory} from "./DailyMedia";

export const loadTimeline = (id) => {
    console.log(`Loading timeline ${id}`);
    return db.prepare("SELECT * FROM timeline WHERE id=$id;").get({id: id});
};

export const getAllTimelines = () => {
    console.log("Get all timelines");
    return db.prepare("SELECT * FROM timeline ORDER BY name ASC;").all();
};

/**
 * Create a new timeline with the given name and return the id.
 * @param {string} name
 * @return {int}
 */
export const createNewTimeline = (name) => {
    //TODO: Handle Exceptions like non-unique names
    let insertResult = db.prepare("INSERT INTO timeline (name) VALUES ($name);").run({name: name});
    return insertResult.lastInsertRowid;
};

export const loadDailyMediaForTimeline = (id, startDate, endDate) => {
    return db.prepare("SELECT m.*, vS.data AS videoStill FROM media AS m LEFT JOIN videoStills vS ON m.timelineId = vS.timelineId AND m.mediaDate = vS.mediaDate WHERE m.timelineId=$id AND m.mediaDate >= $startDate AND m.mediaDate <= $endDate;").all({
        id: id,
        startDate: startDate,
        endDate: endDate,
    });
};

export const getDailyMediaForTimeline = (timelineId) => {
    return db.prepare("SELECT mediaDate, path, videoTimestamp FROM media WHERE timelineId=$id ORDER BY mediaDate ASC;").all({
        id: timelineId,
    });
}

export const safeDailyMediaForTimeline = (timelineId, dailyMedia) => {
    console.log("Saving Timeline to database!");
    const replaceDailyMedia = db.transaction(() => {
        console.log(dateAsIso(dailyMedia));
        db.prepare("INSERT INTO media (timelineId, mediaDate, path, videoTimestamp, mediaType) VALUES ($timelineId, $mediaDate, $path, $videoTimestamp, $mediaType) ON CONFLICT(timelineId, mediaDate) DO UPDATE SET path=$path, videoTimestamp=$videoTimestamp;")
            .run({
                timelineId: timelineId,
                mediaDate: dateAsIso(dailyMedia),
                path: dailyMedia.filePath,
                videoTimestamp: dailyMedia.timeStamp,
                mediaType: fileTypeCategory(dailyMedia),
            });
        db.prepare("DELETE FROM videoStills WHERE timelineId=$timelineId AND mediaDate=$mediaDate;")
            .run({
                timelineId: timelineId,
                mediaDate: dateAsIso(dailyMedia),
            });
        if (dailyMedia.videoStill) {
            db.prepare("INSERT INTO videoStills(timelineId, mediaDate, data) VALUES($timelineId, $mediaDate, $data);")
                .run({
                    timelineId: timelineId,
                    mediaDate: dateAsIso(dailyMedia),
                    data: dailyMedia.videoStill,
                });
        }
    });
    replaceDailyMedia();
};