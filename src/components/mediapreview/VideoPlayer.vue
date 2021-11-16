<template>
  <div class="modal is-active" v-if="isVisible">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="columns">
        <div class="column">
          <video width="400" id="videoPreviewPlayer">
            <source :src="videoSrc">
          </video>
          <div class="videocontrols">
            <button class="play" data-icon="P" aria-label="play pause toggle" @click="togglePlayPauseVideo">Play</button>
            <button class="play" data-icon="P" aria-label="play pause toggle" @click="togglePlayPauseLooped">Looped</button>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <button class="button" value="Cancel" @click="closeVideoPlayer">{{ $t('button.cancel') }}</button>
        </div>
        <div class="column">
          <button class="button is-primary" @click="acceptVideo" id="videoPlayerAcceptButton">{{ $t('button.accept') }}</button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" @click="closeVideoPlayer"></button>
  </div>
</template>

<script>
import * as sc from '@/store-constants'
import i18n from '@/i18n'
function loopPlayEventHandler (event) {
  const media = event.currentTarget
  if (media.currentTime > media.startPoint + 1.5) {
    media.currentTime = media.startPoint
  }
}
export default {
  name: 'VideoPlayer',
  data: function () {
    return {
      loopStartTime: 0.0,
      playLooped: false
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
      this.resetLoop()
      if (media.paused) {
        media.play()
      } else { media.pause() }
    },
    togglePlayPauseLooped: function () {
      const media = document.getElementById('videoPreviewPlayer')
      if (media.paused) {
        this.loopStartTime = media.currentTime
        media.startPoint = this.loopStartTime
        media.addEventListener('timeupdate', loopPlayEventHandler)
        media.play()
      } else {
        media.pause()
        media.currentTime = this.loopStartTime
      }
    },
    resetLoop () {
      const media = document.getElementById('videoPreviewPlayer')
      media.removeEventListener('timeupdate', loopPlayEventHandler)
      this.loopStartTime = 0.0
      this.playLooped = false
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
        console.log('closed window')
        this.resetLoop()
      }
    }
  }
}
</script>

<style scoped>
.columns {
  overflow: hidden;
}

.modal-content {
  overflow: hidden;
}
</style>
