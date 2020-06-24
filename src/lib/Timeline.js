"use strict";

class Timeline {
    /**
     *
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }
}
const timeLineLoader = () => {
    return "Year";
}
module.exports.Timeline = Timeline;
module.exports.timelineLoader = timeLineLoader;