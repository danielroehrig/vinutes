<template>
  <div class="modal is-active" v-if="isVisible">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="columns">
        <div class="column">
          <video width="400" id="videoPreviewPlayer" controls>
            <source :src="videoSrc">
          </video>
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

export default {
  name: 'VideoPlayer',
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
      ipcRenderer.send('create-video-screenshot', currentDailyMedia, currentTimeline)
      this.$store.commit('setCurrentDailyMedia', null)
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    }
  },
  watch: {
    videoSrc: function (newSrc, oldSrc) {
      console.log('new Source ' + newSrc + ' old Source ' + oldSrc)
      if (newSrc) {
        this.$nextTick(function () {
          const lastVideoSource = document.querySelector('source:last-child')// TODO: Document might be replacable by something that only searches within this component
          lastVideoSource.addEventListener('error', (event) => {
            const unknownMediaMessage = i18n.t('error.unknown-media-type').toString()
            this.$buefy.toast.open({
              message: unknownMediaMessage,
              position: 'is-bottom',
              type: 'is-danger'
            })
            this.closeVideoPlayer()
          })
        })
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
