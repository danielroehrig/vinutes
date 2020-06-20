"use strict";

const internal = {};

module.exports = internal.JasConfig = class{
    constructor() {
        this.timelines = [];
    }

    static from(json) {
        return Object.assign(new internal.JasConfig(), json);
    }
}
