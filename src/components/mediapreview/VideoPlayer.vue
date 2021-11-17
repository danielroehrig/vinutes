<template>
  <b-modal
      :active="isVisible"
      v-on:close="closeVideoPlayer"
  >
    <div class="modal-content">
      <div class="columns">
        <div class="column">
          <video width="400" id="videoPreviewPlayer" v-on:timeupdate="loopPlayEventHandler">
            <source :src="videoSrc">
          </video>
          <div class="videocontrols">
            <b-slider v-model="sliderPosition" class="pl-3 pr-3" v-on:dragstart="sliderDragStart" v-on:dragging="sliderDragged" v-on:dragend="sliderDragend" v-on:change="sliderChanged"></b-slider>
            <button class="button ml-2 is-primary" @click="togglePlayPauseVideo"><i class="mdi mdi-24px" :class="{'mdi-play': this.showPlayButton, 'mdi-pause': !this.showPlayButton}"></i></button>
            <button class="button ml-2" :class="{'is-primary': this.playLooped}" @click="togglePlayLooped" id="buttonTogglePlayLooped"><i class="mdi mdi-sync mdi-24px"></i></button>
            <button class="button is-primary is-pulled-right mr-2" @click="acceptVideo" id="videoPlayerAcceptButton">
              {{ $t('button.accept') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import * as sc from '@/store-constants'
import i18n from '@/i18n'

export default {
  name: 'VideoPlayer',
  data: function () {
    return {
      loopStartTime: 0.0,
      playLooped: false,
      sliderPosition: 0,
      wasPlayingWhenDragged: false,
      showPlayButton: true
    }
  },
  computed: {
    videoSrc () {
      return this.$store.state.currentDailyMediaShown !== null ? 'file://' + this.$store.state.currentDailyMediaShown.filePath : null
    },
    isVisible () {
      return this.$store.state.appState === sc.APP_STATE_VIDEO_PLAYER
    }
  },
  methods: {
    closeVideoPlayer: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
      this.resetLoop()
    },
    acceptVideo: function () {
      const videoPreviewPlayer = document.getElementById('videoPreviewPlayer')
      const currentDailyMedia = this.$store.state.currentDailyMediaShown
      const currentTimeline = this.$store.state.currentTimeline
      this.$store.dispatch('acceptVideo', videoPreviewPlayer.currentTime)
      // TODO: creating a video screenshot fails, nothing happens and I'm not sure if that crashes the app
      window.ipc.createVideoScreenshot(currentDailyMedia, currentTimeline)
      this.$store.commit('setCurrentDailyMedia', null)
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    },
    togglePlayPauseVideo: function () {
      const media = document.getElementById('videoPreviewPlayer')

      if (media.paused) {
        if (this.playLooped) {
          this.loopStartTime = media.currentTime
          media.startPoint = this.loopStartTime
        }
        this.showPlayButton = false
        media.play()
      } else {
        media.pause()
        this.showPlayButton = true
        if (this.playLooped) {
          media.currentTime = this.loopStartTime
        }
      }
    },
    loopPlayEventHandler: function (event) {
      const media = document.getElementById('videoPreviewPlayer')
      if (this.playLooped && media.currentTime > this.loopStartTime + 1.5) {
        media.currentTime = this.loopStartTime
      }
      const playedPercentage = media.currentTime / media.duration
      this.sliderPosition = 100 * playedPercentage
      if (playedPercentage === 1) {
        this.showPlayButton = true
      }
    },
    togglePlayLooped: function () {
      const media = document.getElementById('videoPreviewPlayer')
      if (!this.playLooped) {
        this.loopStartTime = media.currentTime
        this.playLooped = true
      } else {
        this.playLooped = false
      }
    },
    sliderDragStart: function () {
      const media = document.getElementById('videoPreviewPlayer')
      this.playLooped = false
      if (!media.paused) {
        this.wasPlayingWhenDragged = true
        media.pause()
      } else {
        this.wasPlayingWhenDragged = false
      }
    },
    sliderDragged: function () {
      const media = document.getElementById('videoPreviewPlayer')
      media.currentTime = this.sliderPosition / 100 * media.duration
    },
    sliderDragend: function () {
      if (this.wasPlayingWhenDragged) {
        const media = document.getElementById('videoPreviewPlayer')
        media.play()
      }
      this.wasPlayingWhenDragged = false
    },
    sliderChanged: function (sliderPosition) {
      console.log('Slider Changed')
      const media = document.getElementById('videoPreviewPlayer')
      media.currentTime = sliderPosition / 100 * media.duration
      this.loopStartTime = media.currentTime
    },
    resetLoop () {
      this.loopStartTime = 0.0
      this.playLooped = false
      this.wasPlayingWhenDragged = false
      this.showPlayButton = true
      this.sliderPosition = 0
    }
  },
  watch: {
    isVisible: function (isVisible, wasVisible) {
      if (isVisible) {
        this.$nextTick(function () {
          const lastVideoSource = document.querySelector('source:last-child')// TODO: Document might be replacable by something that only searches within this component
          lastVideoSource.addEventListener('error', (event) => {
            const unplayableMediumMessage = i18n.t('error.unplayable-media').toString()
            this.$buefy.toast.open({
              message: unplayableMediumMessage,
              position: 'is-bottom',
              type: 'is-danger',
              duration: '3000'
            })
            this.closeVideoPlayer()
          })
        })
      } else {
        this.resetLoop()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "sass/vinutes";

#videoPreviewPlayer {
  border: $primary-light 3px solid;
  margin-bottom: -7px;
}

#buttonTogglePlayLooped:focus {
  box-shadow: none;
  border-color: #dbdbdb;
}

.videocontrols {
  width: 400px;
  background: $primary-light;
  margin: 0 auto;
  padding: 5px 0;
  border-radius: 0 0 5px 5px;
  text-align: left;
}
</style>
