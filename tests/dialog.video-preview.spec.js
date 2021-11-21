import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import VideoPlayer from '@/components/mediapreview/VideoPlayer'
import Vuex from 'vuex'
import * as sc from '@/store-constants'
import Buefy from 'buefy'
Vue.use(Vuex)
const $t = jest.fn()
Vue.use(Buefy)

let playStub, pauseStub

afterEach(() => {
  console.log('after each called')
  jest.restoreAllMocks()
})

beforeEach(() => {
  playStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'play')
    .mockImplementation(() => {
    })
  pauseStub = jest
    .spyOn(window.HTMLMediaElement.prototype, 'pause')
    .mockImplementation(() => {
    })
}
)
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

  it('shows the play button on startup', async () => {
    jest
      .spyOn(window.HTMLMediaElement.prototype, 'paused', 'get')
      .mockImplementation(() => {
        return true
      })
    expect(playPauseButton.exists()).toBe(true)
    expect(playPauseButton.find('i').classes('mdi-play')).toBe(true)
  })
  it('clicks play button which becomes the pause button', async () => {
    jest
      .spyOn(window.HTMLMediaElement.prototype, 'paused', 'get')
      .mockImplementation(() => {
        return true
      })
    expect(playPauseButton.exists()).toBe(true)
    expect(playPauseButton.find('i').classes('mdi-play')).toBe(true)
    playPauseButton.trigger('click')
    expect(playStub).toHaveBeenCalled()
    await wrapper.vm.$nextTick().then(() => {
      expect(playPauseButton.find('i').classes('mdi-play')).toBe(false)
      expect(playPauseButton.find('i').classes('mdi-pause')).toBe(true)
    })
  })
  it('clicks the pause button and reverts to play', async () => {
    jest
      .spyOn(window.HTMLMediaElement.prototype, 'paused', 'get')
      .mockImplementation(() => {
        return false
      })
    playPauseButton.trigger('click')
    expect(pauseStub).toHaveBeenCalled()
    await wrapper.vm.$nextTick().then(() => {
      expect(playPauseButton.find('i').classes('mdi-play')).toBe(true)
    })
  })
  it('shows the loop button toggled of', () => {
    expect(loopToggleButton.exists()).toBe(true)
    expect(loopToggleButton.classes('is-primary')).toBe(false)
  })
})
