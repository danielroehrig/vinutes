"use strict";
const fs = require("fs");
const path = require("path");
const log = require("electron-log");

class Timeline {
    /**
     *
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Create a new Timeline from an object
     * @param {Object} data
     */
    static from(data) {
        if(!data.name || typeof data.name !== "string" ){
            throw Error("No name given or name not a string");
        }
        return new Timeline(data.name);
    }

    get [Symbol.toStringTag]() {
        return "Timeline";
    }
}

/**
 *
 * @param {string}timelinesDirPath
 * @throws Path not readable
 */
const timeLineLoader = (timelinesDirPath) => {
    const timelinePaths = getTimelinePaths(timelinesDirPath);
    let timelines = timelinePaths.map((filePath) => {
        try {
            const buffer = fs.readFileSync(filePath, {encoding: "utf8", flag: "r"});
            const timelineJsonData = JSON.parse(buffer.toString());
            return Timeline.from(timelineJsonData);
        } catch (e) {
            log.warn(e.message);
            return false;
        }
    });
    return timelines.filter((timeline) => timeline);
};

/**
 *
 * @param timelinesDirPath
 * @returns {string[]}
 * @throws Error
 */
const getTimelinePaths = (timelinesDirPath) => {
    /** @type {fs.Dirent[]} */
    let filesInDir = fs.readdirSync(timelinesDirPath, {encoding: "utf8", withFileTypes: true});

    const timelines = filesInDir.filter((dirent) => {
        return dirent.isFile() && path.extname(dirent.name) === ".json";
    });
    return timelines.map((dirent) => {
        return path.join(timelinesDirPath, dirent.name);
    });
};
/**
 * Write a timeline to disc.
 * @param {Timeline} timeline
 * @param {string} timelinesDirPath
 */
const saveTimeline = (timeline, timelinesDirPath) =>{
    //TODO check if file with that name exists(?) Or on rename? Or maybe don't use name but an id?
    fs.writeFileSync(path.join(timelinesDirPath, (timeline.name+'.json')), JSON.stringify(timeline));
}

module.exports.Timeline = Timeline;
module.exports.timelineLoader = timeLineLoader;
module.exports.saveTimeline = saveTimeline;