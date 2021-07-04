<template>
  <div class="column">
    <button v-if="isVisible && hasMedia" class="delete is-pulled-right removeMedia" @click="removeMedia" :id="deleteButtonId"></button>
    <div class="box calendar-day" :id="dayId" :class="{'inactive': !isVisible, 'withMedia': (hasMedia), 'dragged': this.draggedOver }" :style="styling"
         @click="calendarDayClicked" @drop.prevent="droppedFile" @dragover.prevent @dragenter.prevent="draggedFile" @dragleave="leaveDrag">
      <div class="date">
        {{ isVisible ? timestampString : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapMutations, mapState } from 'vuex'
import * as sc from '@/store-constants'
import DailyMedia from '@/lib/DailyMedia'
import store from '@/store'
import i18n from '@/i18n'

export default {
  name: 'CalendarDay',
  data () {
    return {
      draggedOver: false
    }
  },
  props: {
    day: Number
  },
  computed: {
    ...mapState([
      'currentYear',
      'currentMonth',
      'mediaFiles',
      'language',
      'calendarTimeStampFormat',
      'currentTimeline'
    ]),
    deleteButtonId () {
      return this.dayId + 'DeleteButton'
    },
    dayId () {
      return 'calendarDay' + this.day
    },
    hasMedia () {
      return this.dailyMedia
    },
    isVisible () {
      return this.day !== 0
    },
    timestampString () {
      moment.locale(this.language)
      const currentMoment = moment({
        year: this.currentYear,
        month: this.currentMonth,
        day: this.day
      })
      return currentMoment.format(this.calendarTimeStampFormat)
    },
    dailyMedia () {
      return this.mediaFiles[this.day]
    },
    styling () {
      const mediaFile = this.dailyMedia
      if (mediaFile && mediaFile.previewImage) {
        return {
          backgroundImage: 'url(\'data:image/jpeg;charset=utf-8;base64,' + mediaFile.previewImage + '\')'
        }
      }
      return {}
    }
  },
  methods: {
    ...mapActions({
      clicked: 'calendarDayClicked'
    }),
    ...mapMutations([
      'changeAppState',
      'setCurrentDaySelected',
      'setCurrentDailyMedia'
    ]),
    /**
     * React to the day being clicked
     * @return void
     */
    calendarDayClicked () {
      if (this.currentTimeline === null) {
        this.changeAppState(sc.APP_STATE_CREATE_TIMELINE)
        return
      }
      this.setCurrentDaySelected(this.day)
      const mediaFile = this.mediaFiles[this.day]
      if (mediaFile) {
        this.setCurrentDailyMedia(mediaFile)
        const newState = mediaFile.mediaType === 'video' ? sc.APP_STATE_VIDEO_PLAYER : sc.APP_STATE_IMAGE_VIEWER
        this.changeAppState(newState)
        return
      }
      this.changeAppState(sc.APP_STATE_CHOOSE_MEDIA_FILE)
    },
    removeMedia () {
      this.setCurrentDaySelected(this.day)
      this.$store.commit('changeAppState', sc.APP_STATE_CONFIRM_MEDIA_DELETE)
    },
    draggedFile () {
      this.draggedOver = true
    },
    leaveDrag () {
      this.draggedOver = false
    },
    droppedFile (ev) {
      this.draggedOver = false
      const file = ev.dataTransfer.items[0].getAsFile()
      const mediaType = ipcRenderer.sendSync('get-media-type', file.path)
      if (mediaType === null) {
        store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
        const unknownMediaMessage = i18n.t('error.unknown-media-type').toString()
        this.$buefy.toast.open({
          message: unknownMediaMessage,
          position: 'is-bottom',
          type: 'is-danger'
        })
        return
      }
      const dailyMedia = new DailyMedia(this.currentYear, this.currentMonth + 1, this.day, file.path, mediaType)
      if (dailyMedia.mediaType === 'image') {
        ipcRenderer.send('render-image-preview', dailyMedia)
        return
      }
      this.$store.commit('setCurrentDailyMedia', dailyMedia)
      this.$store.commit('changeAppState', sc.APP_STATE_VIDEO_PLAYER)
    }
  }
}
</script>

<style scoped>
div.column {
  padding: 5px;
}

div.inactive {
  visibility: hidden;
}

div.withMedia {
  background-position: center;
  background-size: cover;
  color: white;
  text-shadow: 1px 1px #333333;
}

div.box {
  width: 100%;
  padding: 56.25% 0 0 0;
  position: relative; /* If you want text inside of it */
}

div.date {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 20px;
}

button.removeMedia {
  z-index: 1;
  margin: 5px 5px;
}
</style>

<style scoped lang="scss">
@import "sass/vinutes";

div.box:hover {
  cursor: pointer;
}

div.box:hover, div.box.dragged {
  background-color: $primary;
  color: white;
}

div.box.dragged {
  cursor: grab;
}
</style>
