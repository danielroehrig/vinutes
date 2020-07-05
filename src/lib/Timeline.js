"use strict";
export default class Timeline {
    /**
     *
     * @param {string} name
     * @param {int} id
     */
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.dailyMedia = [];
    }

    get path() {
        return `timeline_${this.id}.json`;
    }

    /**
     * Create a new Timeline from an object
     * @param {Object} data
     */
    static from(data) {

        let timeline = new Timeline(data.name, data.id);
        timeline.dailyMedia = data.dailyMedia.map((mediumData)=>{
            return DailyMedia.from(mediumData);
        });
        return timeline;
    }

    get [Symbol.toStringTag]() {
        return "Timeline";
    }
}