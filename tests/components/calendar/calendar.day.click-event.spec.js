import { shallowMount } from '@vue/test-utils'
import CalendarDay from '@/components/calendar/CalendarDay.vue'
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const $t = jest.fn()

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
describe('CalendarDay.vue click event', () => {
  it('click on day triggers action', () => {
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
  // TODO: Remove media
  // TODO: Show image or base64 screenshot
  // TODO: Check it emits the right day to the store
})
