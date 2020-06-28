const {DailyMedia} = require("../../../../src/lib/DailyMedia");
const chai = require("chai");
const expect = chai.expect;

describe("DailyMedia parsing", () => {
    describe("Find custom type for DailyMedia", () => {
        it("should return the type DailyMedia on typeof", () => {
            const dailyMedia = new DailyMedia(2020,4,27,"/some/path");
            expect(dailyMedia).to.be.a("DailyMedia");
        });
    });
    describe("Parse correct video media from object", () => {
        it("should parse a video with just date and path", () => {
            const dailyMedia = DailyMedia.from({
                "year": 2020, "month": 4, "day": 27, "filePath": "/rand/path",
            });
            expect(dailyMedia.year).to.equal(2020);
            expect(dailyMedia.month).to.equal(4);
            expect(dailyMedia.day).to.equal(27);
            expect(dailyMedia.filePath).to.equal("/rand/path");
        });
    });
});