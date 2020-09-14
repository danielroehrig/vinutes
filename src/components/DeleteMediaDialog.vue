<template>
  <div class="modal" :class="{'is-active': isVisible}">
    <div class="modal-background"></div>
    <div class="modal-card" style="width: 440px">
      <header class="modal-card-head">
        <p class="modal-card-title">Delete Media</p>
      </header>
      <section class="modal-card-body">
          <h1 class="is-bold">Do you want to delete this media file from this timeline?</h1>
          <figure class="image">
          <img :src="videoStill">
          </figure>
        <p>{{ fullDate }}</p>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="cancel">Cancel</button>
        <button class="button is-danger" @click="deleteMediaFile">Delete</button>
      </footer>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import * as sc from '@/store-constants'
import moment from 'moment'
export default {
  name: 'DeleteMediaDialog',
  computed: {
    ...mapState([
      'appState',
      'currentDaySelected',
      'mediaFiles',
      'language',
      'calendarTimeStampFormat'
    ]),
    mediaFile () {
      if (this.currentDaySelected && this.isVisible) {
        return this.mediaFiles[this.currentDaySelected]
      }
      return null
    },
    isVisible () {
      return this.appState === sc.APP_STATE_CONFIRM_MEDIA_DELETE
    },
    fullDate () {
      if (this.mediaFile) {
        moment.locale(this.language)
        return this.mediaFile.dateAsMoment.format(this.calendarTimeStampFormat)
      }
      return null
    },
    videoStill () {
      if (this.mediaFile) {
        return 'data:image/jpeg;charset=utf-8;base64,' + this.mediaFile.videoStill
      }
      return null
    }
  },
  methods: {
    ...mapMutations([
      'changeAppState'
    ]),
    ...mapActions([
      'removeCurrentMediaFile'
    ]),
    cancel: function () {
      this.changeAppState(sc.APP_STATE_CALENDAR_VIEW)
    },
    deleteMediaFile: function () {
      this.removeCurrentMediaFile()
      // TODO Handle errors
    }
  }
}
</script>
