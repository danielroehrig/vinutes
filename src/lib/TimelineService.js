import {dateAsIso} from "./DailyMedia";

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
    return db.prepare("SELECT * FROM media WHERE timelineId=$id AND mediaDate >= $startDate AND mediaDate <= $endDate;").all({
        id: id,
        startDate: startDate,
        endDate: endDate,
    });
};

export const safeDailyMediaForTimeline = (timelineId, dailyMedia) => {
    console.log("Saving Timeline to database!");
    const replaceDailyMedia = db.transaction(() => {
        db.prepare("INSERT INTO media (timelineId, mediaDate, path, videoTimestamp) VALUES ($timelineId, $mediaDate, $path, $videoTimestamp) ON CONFLICT(timelineId, mediaDate) DO UPDATE SET path=$path, videoTimestamp=$videoTimestamp;")
            .run({
                timelineId: timelineId,
                mediaDate: dateAsIso(dailyMedia),
                path: dailyMedia.filePath,
                videoTimestamp: dailyMedia.timeStamp,
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