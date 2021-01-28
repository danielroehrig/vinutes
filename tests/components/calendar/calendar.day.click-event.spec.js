import { shallowMount } from '@vue/test-utils'
import CalendarDay from '@/components/calendar/CalendarDay.vue'
import Vuex from 'vuex'
import Vue from 'vue'
import * as sc from '@/store-constants'
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
    const fakeChangeAppState = jest.fn()
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        currentMonth: 11,
        currentYear: 2018,
        currentDaySelected: null,
        currentTimeline: null
      },
      mutations: {
        changeAppState: fakeChangeAppState
      }
    }
    )
    const day = 7
    const wrapper = mountWithStore(store, { day })
    wrapper.find('div.box').trigger('click')
    expect(fakeChangeAppState).toHaveBeenCalledWith(expect.anything(), sc.APP_STATE_CREATE_TIMELINE)
  })
  // TODO: Remove media
  // TODO: Show image or base64 screenshot
  // TODO: Check it emits the right day to the store
})
