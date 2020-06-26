"use strict";
const fs = require('fs');
const path = require('path');

class Timeline {
    /**
     *
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }
}


const timeLineLoader = (timelinesDirPath) => {
    const timelinePaths = getTimelinePaths(timelinesDirPath);
}

const getTimelinePaths = (timelinesDirPath)=>{
    /** @type {fs.Dirent[]} */
    let filesInDir = fs.readdirSync(timelinesDirPath, {encoding: 'utf8', withFileTypes: true});

    const timelines = filesInDir.filter((dirent)=>{
        return dirent.isFile() && path.extname(dirent.name)==='.json';
    });
    return timelines.map((dirent)=>{
        return path.join(timelinesDirPath, dirent.name);
    });
}

module.exports.Timeline = Timeline;
module.exports.timelineLoader = timeLineLoader;