import DailyMedia, {dateAsIso} from "../../../../src/lib/DailyMedia";
const expect = require('chai').expect;

describe("Date as ISO ", () => {
    it("displays the daily media time stamp as ISO", () => {
        const dailyMedia = new DailyMedia(2004,1, 27, "", "", 0.0);
        expect(dateAsIso(dailyMedia)).to.equal("2004-01-27");
        expect(dailyMedia.dateAsIso).to.equal("2004-01-27");
    });
});