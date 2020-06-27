const chai = require("chai");
const expect = chai.expect;
const {Timeline} = require("../../../../src/lib/Timeline");

describe("Timeline parsing", () => {
    describe("parse correct timeline", () => {
        it("should find all parameters in a correct timeline", () => {
            const timeline = Timeline.from({
                "name": "Test Timeline"
            });
            expect(timeline.name).to.equal("Test Timeline");
        });
    });

    describe("parse timeline with missing parameters", () => {
        it("should find all parameters in a correct timeline", () => {
            expect(()=>Timeline.from({
                "wrong_arameter": "Nonsense"
            })).to.Throw();
        });
    });
});