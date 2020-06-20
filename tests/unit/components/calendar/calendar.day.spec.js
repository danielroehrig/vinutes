import {expect} from "chai";
import {shallowMount} from "@vue/test-utils";
import CalendarDay from "@/components/calendar/CalendarDay.vue";
import store from "../../../../src/store";
import moment from "moment";

describe("CalendarDay.vue", () => {
    it("displays current month, year and the props day when passed", () => {
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
        expect(wrapper.text()).to.include(testMoment.format(store.state.calendarTimesTampFormat));
        expect(wrapper.get('div.box').classes()).to.not.include('inactive');
    });

    it("displays nothing if day is zero", () => {
        const day = 0;
        const wrapper = shallowMount(CalendarDay, {
            store: store,
            propsData: {day},
        });

        expect(wrapper.get('div.box').classes()).to.include('inactive');
    });
});
