import { shallowMount } from '@vue/test-utils'
import CalendarDay from '@/components/calendar/CalendarDay.vue'
import Vuex from 'vuex'
import moment from 'moment'
import Vue from 'vue'
Vue.use(Vuex)
const $t = jest.fn()
const currentYear = moment().year()
const currentMonth = moment().month()

const mountWithStore = (store, propsData) => {
  const propsDataObj = propsData !== null ? propsData : {}
  return shallowMount(CalendarDay, {
    store: store,
    mocks: {
      $t
    },
    propsData: propsDataObj
  })
}

describe('CalendarDay.vue', () => {
  it('displays current month, year and the props day when passed', () => {
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        currentYear: currentYear,
        currentMonth: currentMonth,
        calendarTimeStampFormat: 'ddd, D. MMM, Y'
      }
    })
    const day = 17
    const wrapper = mountWithStore(store, { day })
    const testMoment = moment({
      year: currentYear,
      month: currentMonth,
      day: day
    })
    expect(wrapper.text()).toEqual(expect.stringContaining(testMoment.format(store.state.calendarTimeStampFormat)))
    expect(wrapper.get('div.box').classes()).not.toContain('inactive')
  })
  it('displays current month, year in a non default format', () => {
    const day = 2
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        calendarTimeStampFormat: 'Y.M.D',
        currentYear: currentYear,
        currentMonth: currentMonth
      },
      mutations: {
        setCurrentDaySelected (state, day) {
          state.currentDaySelected = day
        }
      }
    }
    )
    const wrapper = mountWithStore(store, { day })
    const testMoment = moment({
      year: moment().year(),
      month: moment().month(),
      day: day
    })
    expect(wrapper.text()).toEqual(expect.stringContaining(testMoment.format(store.state.calendarTimeStampFormat)))
  })
  it('displays nothing if day is zero', () => {
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        currentYear: currentYear,
        currentMonth: currentMonth
      }
    })
    const day = 0
    const wrapper = mountWithStore(store, { day })
    expect(wrapper.get('div.box').classes()).toContain('inactive')
  })
  it('gets the current date from the store right', () => {
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        currentMonth: 11,
        currentYear: 2018
      }
    }
    )
    const day = 7
    const wrapper = mountWithStore(store, { day })
    expect(wrapper.vm.currentMoment().format()).toEqual(moment({ year: 2018, month: 11, day: 7 }).format())
    store.state.currentMonth = 9
    expect(wrapper.vm.currentMoment().format()).toEqual(moment({ year: 2018, month: 9, day: 7 }).format())
  })
  it('click on day triggers current day mutation', () => {
    const fakeCalendarDayClicked = jest.fn()
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        currentMonth: 11,
        currentYear: 2018,
        currentDaySelected: null
      },
      actions: {
        calendarDayClicked: fakeCalendarDayClicked
      }
    }
    )
    const day = 7
    const wrapper = mountWithStore(store, { day })
    wrapper.find('div.box').trigger('click')
    expect(fakeCalendarDayClicked).toHaveBeenCalledWith(expect.anything(), 7)
  })
})
