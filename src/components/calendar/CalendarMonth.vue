<template>
    <section class="section">
        <div class="container is-fluid" id="calendarContainer">
            <CalendarWeek v-for="week in weeks" v-bind:days="week.days" v-bind:key="week.isoWeek" v-bind:isoWeek="week.isoWeek"></CalendarWeek>
            <VideoPlayer></VideoPlayer>
            <ImageViewer></ImageViewer>
        </div>
    </section>
</template>

<script>
import CalendarWeek from './CalendarWeek'
import VideoPlayer from '../mediapreview/VideoPlayer'
import { mapState } from 'vuex'
import moment from 'moment'
import ImageViewer from '@/components/mediapreview/ImageViewer'

const calendar = require('calendar')
const projectCalendar = new calendar.Calendar(1)

export default {
  components: { ImageViewer, VideoPlayer, CalendarWeek },
  computed: {
    weeks () {
      let isoWeek = moment({ year: this.currentYear, month: this.currentMonth, day: 1 }).isoWeek()
      const calendarWeeks = projectCalendar.monthDays(this.currentYear, this.currentMonth)
      const weeks = []
      for (const week of calendarWeeks) {
        weeks.push({
          isoWeek: isoWeek++,
          days: week
        })
      }
      return weeks
    },
    ...mapState([
      'currentYear',
      'currentMonth'
    ])
  }

}
</script>

<style scoped>

</style>
