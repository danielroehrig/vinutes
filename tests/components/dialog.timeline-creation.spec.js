import '@testing-library/jest-dom'
import { shallowMount } from '@vue/test-utils'
import TimelineCreationDialog from '@/components/timeline/TimelineCreationDialog.vue'
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
      state: {},
      getters: {
        timelineNames () {
          return ['Hans', 'Julia']
        }
      }
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
      getters: {
        timelineNames () {
          return ['Hans', 'Julia']
        }
      },
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
      },
      getters: {
        timelineNames () {
          return ['Hans', 'Julia']
        }
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
  it('focuses the input field when the app status changes to APP_STATE_CREATE_TIMELINE', async () => {
    const store = new Vuex.Store({
      state: {
        appState: sc.APP_STATE_CALENDAR_VIEW
      },
      getters: {
        timelineNames () {
          return ['Hans', 'Julia']
        }
      },
      mutations: {
        setActive (state) {
          state.appState = sc.APP_STATE_CREATE_TIMELINE
        },
        changeAppState (state) {
          state.appState = sc.APP_STATE_CALENDAR_VIEW
        }
      },
      actions: {
        loadTimelines: jest.fn(),
        changeTimeline: jest.fn()
      }
    })
    const elem = document.createElement('div')
    document.body.appendChild(elem)
    const wrapper = shallowMount(TimelineCreationDialog, {
      store: store,
      mocks: {
        $t
      },
      attachTo: elem
    })
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    store.commit('setActive')
    await wrapper.vm.$nextTick().then(() => {
      expect(input.element).toHaveFocus()
    })
    const cancelButton = wrapper.get('#timelineCreationDialogButtonCancel')
    cancelButton.trigger('click')
    await wrapper.vm.$nextTick().then(() => {
      expect(input.element).not.toHaveFocus()
    })
  })
  it('checks for duplicated timeline names', async () => {
    const store = new Vuex.Store({
      state: {},
      getters: {
        timelineNames () {
          return ['Hans', 'Julia']
        }
      }
    })
    const wrapper = mountWithStore(store)
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    const submitButton = wrapper.get('#timelineCreationDialogButtonSubmit')
    await input.setValue('Juli')
    expect(submitButton.attributes()).not.toHaveProperty('disabled')
    expect(wrapper.find('#timelineCreationDialogNameWarning').exists()).toBe(false)
    await input.setValue('Julia')
    expect(submitButton.attributes()).toHaveProperty('disabled')
    expect(wrapper.find('#timelineCreationDialogNameWarning').exists()).toBe(true)
    expect(wrapper.find('#timelineCreationDialogNameWarning').element).toBeVisible()
    await input.setValue('Julian')
    expect(submitButton.attributes()).not.toHaveProperty('disabled')
    expect(wrapper.find('#timelineCreationDialogNameWarning').exists()).toBe(false)
  })
  it('checks for database errors', async () => {
    const brokenTimelineCreateCall = jest.fn(name => {
      throw new Error('Some error')
    })
    createNewTimeline.mockImplementation(brokenTimelineCreateCall)
    const store = new Vuex.Store({
      state: {},
      getters: {
        timelineNames () {
          return ['Hans', 'Julia']
        }
      }
    })
    const wrapper = mountWithStore(store)
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    const submitButton = wrapper.get('#timelineCreationDialogButtonSubmit')
    expect(wrapper.find('.timelineCreationDialogErrorMessage').exists()).toBe(false)
    await input.setValue('Klaus')
    submitButton.trigger('click')
    expect(brokenTimelineCreateCall).toHaveBeenCalled()
    await wrapper.vm.$nextTick().then(() => {
      expect(wrapper.find('#timelineCreationDialogErrorMessage').exists()).toBe(true)
    })
    wrapper.get('#timelineCreationDialogErrorMessage>button').trigger('click')
    await wrapper.vm.$nextTick().then(() => {
      expect(wrapper.find('#timelineCreationDialogErrorMessage').exists()).toBe(false)
    })
  })
})
