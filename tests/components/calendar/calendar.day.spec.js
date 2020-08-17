
import {shallowMount} from "@vue/test-utils";
import CalendarDay from "@/components/calendar/CalendarDay.vue";
import Vuex from "vuex";
import moment from "moment";
import Vue from "vue";
import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";

chai.use(sinonChai);
Vue.use(Vuex);

const expect = chai.expect;

describe("CalendarDay.vue", () => {
    it("displays current month, year and the props day when passed", () => {
        const store = new Vuex.Store({
                state: {
                    mediaFiles: {},
                },
            },
        );
        const day = 17;
        const wrapper = shallowMount(CalendarDay, {
            store: store,
            propsData: {day},
        });
        let testMoment = moment({
            year: moment().year(),
            month: moment().month(),
            day: day,
        });
        expect(wrapper.text()).to.include(testMoment.format(store.state.calendarTimeStampFormat));
        expect(wrapper.get('div.box').classes()).to.not.include('inactive');
    });
    it("displays current month, year in a non default format", () => {
        const day = 2;
        const store = new Vuex.Store({
                state: {
                    mediaFiles: {},
                    calendarTimeStampFormat: "Y.M.D"
                },
                mutations: {
                    setCurrentDaySelected(state, day){
                        state.currentDaySelected = day;
                    }
                }
            },
        );
        const wrapper = shallowMount(CalendarDay, {
            store: store,
            propsData: {day},
        });
        let testMoment = moment({
            year: moment().year(),
            month: moment().month(),
            day: day,
        });
        expect(wrapper.text()).to.include(testMoment.format(store.state.calendarTimeStampFormat));
    });
    it("displays nothing if day is zero", () => {
        const store = new Vuex.Store({
                state: {
                    mediaFiles: {},
                },
            },
        );
        const day = 0;
        const wrapper = shallowMount(CalendarDay, {
            store: store,
            propsData: {day},
        });
        expect(wrapper.get("div.box").classes()).to.include("inactive");
    });
    it("get's the current date from the store right", () => {
        const store = new Vuex.Store({
                state: {
                    mediaFiles: {},
                    currentMonth: 11,
                    currentYear: 2018,
                },
            },
        );
        const day = 7;
        const wrapper = shallowMount(CalendarDay, {
            store: store,
            propsData: {day},
        });
        expect(wrapper.vm.currentMoment().format()).to.equal(moment({year: 2018, month: 11, day: 7}).format());
        store.state.currentMonth=9;
        expect(wrapper.vm.currentMoment().format()).to.equal(moment({year: 2018, month: 9, day: 7}).format());
    });
    it("click on day triggers current day mutation", () => {
        const fakeCurrentDaySelected = sinon.fake();
        const store = new Vuex.Store({
                state: {
                    mediaFiles: {},
                    currentMonth: 11,
                    currentYear: 2018,
                    currentDaySelected: null,
                },
                mutations: {
                    setCurrentDaySelected: fakeCurrentDaySelected,
                }
            },
        );
        const day = 7;
        const wrapper = shallowMount(CalendarDay, {
            store: store,
            propsData: {day},
        });
        wrapper.find('div.box').trigger('click');
        expect(fakeCurrentDaySelected).to.be.calledOnceWith(store.state, sinon.match.any, 7);
    });
});
