const chai = require("chai");
const path = require("path");
const expect = chai.expect;
const rewire = require('rewire');
const TimelineModule = rewire("../../../../src/lib/Timeline.js");

const {Timeline, timelineLoader} = require("../../../../src/lib/Timeline");
const timelineFilePathsGetter = TimelineModule.__get__('getTimelinePaths');
const testTimelineDirPath = path.join(__dirname, "../../../data/timelines");

describe("Timelines", () => {
    describe("get timeline file paths", () => {
        it("should find two timelines in test path", () => {
            let timelinePaths = timelineFilePathsGetter(testTimelineDirPath);
            expect(timelinePaths).to.have.lengthOf(2);
        });
    });
    describe("give none existing path", () => {
        it("should throw an error", () => {
            const timelineDirPath = path.join(__dirname, "../../../wrongfolder/timelines");
            expect(() => timelineFilePathsGetter(timelineDirPath)).to.Throw();
        });
    });
    describe("parse two timelines from folder", ()=>{
       it("should return two timeline objects", () => {
            const timelines = timelineLoader(testTimelineDirPath);
            expect(timelines).to.have.lengthOf(2);
       });
    });
});