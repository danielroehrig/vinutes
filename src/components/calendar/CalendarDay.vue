<template>
  <div class="column">
    <button v-if="isVisible && hasMedia" class="delete is-pulled-right removeMedia" @click="removeMedia"></button>
    <div class="box" :class="{'inactive': !isVisible, 'withMedia': (hasMedia) }" :style="styling"
         @click="calendarDayClicked">
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

export default {
  name: 'CalendarDay',
  props: {
    day: Number
  },
  computed: {
    ...mapState([
      'currentYear',
      'currentMonth',
      'mediaFiles',
      'language',
      'calendarTimeStampFormat'
    ]),
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
      'setCurrentDaySelected'
    ]),
    calendarDayClicked: function () {
      this.clicked(this.day)
    },
    removeMedia: function () {
      console.log('Remove this day: ' + this.day)
      this.setCurrentDaySelected(this.day)
      this.$store.commit('changeAppState', sc.APP_STATE_CONFIRM_MEDIA_DELETE)
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

div.box:hover {
  background-color: hsl(171, 100%, 41%);
  color: white;
  cursor: pointer;
}

button.removeMedia {
  z-index: 1;
  margin: 5px 5px;
}
</style>
