import '@testing-library/jest-dom'
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import * as sc from '@/store-constants'
import DeleteMediaDialog from '@/components/DeleteMediaDialog'
import DailyMedia from '@/lib/DailyMedia'

Vue.use(Vuex)

const $t = jest.fn()
const mountWithStore = (store) => {
  return shallowMount(DeleteMediaDialog, {
    store: store,
    mocks: {
      $t
    }
  })
}

describe('DeleteMediaDialog.vue', () => {
  it('show dialog when state is set', async () => {
    const store = new Vuex.Store({
      state: {
        appState: sc.APP_STATE_CALENDAR_VIEW
      },
      mutations: {
        setActive (state) {
          state.appState = sc.APP_STATE_CONFIRM_MEDIA_DELETE
        },
        setInactive (state) {
          state.appState = sc.APP_STATE_CALENDAR_VIEW
        }
      }
    })
    const wrapper = mountWithStore(store)
    const modal = wrapper.get('#deleteMediaDialog')
    expect(modal.classes()).not.toContain('is-active')
    store.commit('setActive')
    await wrapper.vm.$nextTick().then(() => {
      expect(modal.classes()).toContain('is-active')
    })
  })
  it('gets full date depending on language and date in mediafile', async () => {
    const testMediaFile = new DailyMedia(2018, 3, 2, 'some/path', 'video')
    const store = new Vuex.Store({
      state: {
        appState: sc.APP_STATE_CONFIRM_MEDIA_DELETE,
        currentDaySelected: 2,
        language: 'en',
        calendarTimeStampFormat: 'll',
        mediaFiles: {
          2: testMediaFile
        }
      },
      mutations: {
        switchToGerman (state) {
          state.language = 'de'
        }
      }
    })
    const wrapper = mountWithStore(store)
    expect(wrapper.vm.mediaFile).toBe(testMediaFile)
    expect(wrapper.vm.isVisible).toBe(true)
    expect(wrapper.vm.fullDate).toBe('Mar 2, 2018')
    store.commit('switchToGerman')
    await wrapper.vm.$nextTick().then(() => {
      expect(wrapper.vm.fullDate).toBe('2. März 2018')
    })
    // TODO: Switch mediaFile
    // TODO: Set mediaFile to empty
    // TODO: Test video still
  })
})
