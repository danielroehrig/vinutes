import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import VideoPlayer from '@/components/mediapreview/VideoPlayer'
import Vuex from 'vuex'
import * as sc from '@/store-constants'
import Buefy from 'buefy'
Vue.use(Vuex)
const $t = jest.fn()
Vue.use(Buefy)

describe('VideoPlayer.vue', () => {
  const wrapper = shallowMount(VideoPlayer, {
    store: new Vuex.Store({
      state: {
        appState: sc.APP_STATE_VIDEO_PLAYER,
        currentDailyMediaShown: null
      }
    }),
    mocks: {
      $t
    },
    attachTo: document.body
  })
  const playPauseButton = wrapper.find('#videoPlayerPlayPauseButton')
  const loopToggleButton = wrapper.find('#buttonTogglePlayLooped')
  it('show the play button on startup', () => {
    expect(playPauseButton.exists()).toBe(true)
    expect(playPauseButton.find('i').classes('mdi-play')).toBe(true)
  })
  it('shows the loop button toggled of', () => {
    expect(loopToggleButton.exists()).toBe(true)
    expect(loopToggleButton.classes('is-primary')).toBe(false)
  })
})
