import '@testing-library/jest-dom'
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import * as sc from '@/store-constants'
import DeleteMediaDialog from '@/components/DeleteMediaDialog'

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
})
