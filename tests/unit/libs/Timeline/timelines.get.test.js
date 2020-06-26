const chai = require("chai");
const path = require("path");
const should = chai.should();
const rewire = require('rewire');
const TimelineModule = rewire("../../../../src/lib/Timeline.js");

const {Timeline, timelineLoader} = require("../../../../src/lib/Timeline");

describe("Timelines", () => {
    describe("get timeline file paths", () => {
        it("should find two timelines in test path", () => {
            const timelineDirPath = path.join(__dirname, "../../../data/timelines");
            let timelineFilePathsGetter = TimelineModule.__get__('getTimelinePaths');
            let timelinePaths = timelineFilePathsGetter(timelineDirPath);
            timelinePaths.should.have.lengthOf(2);
        });
    });
});