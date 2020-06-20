import {expect} from "chai";
import {shallowMount} from "@vue/test-utils";
import CalendarDay from "@/components/calendar/CalendarDay.vue";
import store from "../../../../src/store";
import moment from "moment";

describe("CalendarDay.vue", () => {
    it("displace current month, year and the props day when passed", () => {
        const day = 17;
        const wrapper = shallowMount(CalendarDay, {
            store: store,
            propsData: {day},
        });
        let testMoment = moment({
            year: moment().year(),
            month: moment().month(),
            day: day
        });
        expect(wrapper.text()).to.include(testMoment.format("ddd, D. MMM, Y"));
    });
});
