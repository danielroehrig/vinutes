import { shallowMount } from '@vue/test-utils'
import TimelineCreationDialog from '@/components/TimelineCreationDialog.vue'
import Vuex from 'vuex'
import Vue from 'vue'
import * as sc from '@/store-constants'
import { createNewTimeline } from '@/lib/TimelineService'

Vue.use(Vuex)
jest.mock('@/lib/TimelineService', () => ({
  createNewTimeline: jest.fn(name => 1)
}))
const $t = jest.fn()

const mountWithStore = (store) => {
  return shallowMount(TimelineCreationDialog, {
    store: store,
    mocks: {
      $t
    }
  })
}

describe('TimelineCreationDialog.vue', () => {
  it('empty name disables submit button', async () => {
    const store = new Vuex.Store({
      state: {}
    })
    const wrapper = mountWithStore(store)
    await wrapper.setData({ newTimelineName: null })
    const submitButton = wrapper.get('#timelineCreationDialogButtonSubmit')
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    expect(submitButton.attributes()).toHaveProperty('disabled', 'disabled')
    await input.setValue('a')
    expect(wrapper.vm.$data.newTimelineName).toBe('a')
    expect(submitButton.attributes()).not.toHaveProperty('disabled')
    await input.setValue(' ')
    expect(submitButton.attributes()).toHaveProperty('disabled')
  })
  it('cancel clears name', async () => {
    const fakeChangeAppStateFunction = jest.fn()
    const store = new Vuex.Store({
      state: {},
      mutations: {
        changeAppState: fakeChangeAppStateFunction
      }
    })
    const wrapper = mountWithStore(store)
    await wrapper.setData({ newTimelineName: null })
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    const cancelButton = wrapper.get('#timelineCreationDialogButtonCancel')
    await input.setValue('New Timeline Name')
    expect(wrapper.vm.$data.newTimelineName).toBe('New Timeline Name')
    await cancelButton.trigger('click')
    expect(wrapper.vm.$data.newTimelineName).toBe(null)
    expect(fakeChangeAppStateFunction).toHaveBeenCalledWith(expect.anything(), sc.APP_STATE_CALENDAR_VIEW)
  })
  it('return submits timeline name', async () => {
    const fakeChangeAppStateFunction = jest.fn()
    const store = new Vuex.Store({
      state: {},
      mutations: {
        changeAppState: fakeChangeAppStateFunction
      },
      actions: {
        loadTimelines: jest.fn(),
        changeTimeline: jest.fn()
      }
    })
    const wrapper = mountWithStore(store)
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    await input.setValue('Some Timeline name')
    expect(wrapper.vm.$data.newTimelineName).toBe('Some Timeline name')
    await input.trigger('keyup.enter')
    expect(createNewTimeline).toHaveBeenCalledTimes(1)
    expect(createNewTimeline).toHaveBeenCalledWith('Some Timeline name')
    expect(wrapper.vm.$data.newTimelineName).toBe(null)
  })
  // TODO Focus on app status change
  // TODO duplicate timeline names
  // TODO Database says no (title too long, collision, whatevs)
})
