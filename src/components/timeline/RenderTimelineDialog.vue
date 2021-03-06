<template>
  <div class="modal" :class="{'is-active': isVisible}" id="deleteMediaDialog">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('action.render-time-span') }}</p>
      </header>
      <section class="modal-card-body">
        <div class="tabs is-centered is-fullwidth is-toggle">
          <ul>
            <li :class="{'is-active': tabSelected('whole')}"><a @click="selectTab('whole')">{{
                $t('whole-time-line')
              }}</a></li>
            <li :class="{'is-active': tabSelected('month')}"><a @click="selectTab('month')">{{ $t('month') }}</a></li>
            <li :class="{'is-active': tabSelected('year')}"><a @click="selectTab('year')">{{ $t('year') }}</a></li>
            <li :class="{'is-active': tabSelected('custom')}"><a @click="selectTab('custom')">{{ $t('custom') }}</a>
            </li>
          </ul>
        </div>
        <div :class="{'is-hidden': !tabSelected('whole')}">
          <i>{{ $t('text.render-whole-timeline') }}</i>
        </div>
        <div :class="{'is-hidden': !tabSelected('month')}">
          <i>{{ $t('text.render-current-month') }}</i>
        </div>
        <div :class="{'is-hidden': !tabSelected('year')}">
          <i>{{ $t('text.render-current-year') }}</i>
        </div>
        <div class="field" :class="{'is-hidden': !tabSelected('custom')}">
          <div class="control">
            <input type="date" id="renderTimeSpanDialogDateSpanChooser" ref='calendarTrigger'>
            <i>{{ $t('text.render-custom') }}</i>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <b-button type="is-primary" @click="accept" :disabled="!acceptButtonEnabled">{{
            $t('button.render')
          }}
        </b-button>
        <b-button @click="cancel">{{ $t('button.cancel') }}</b-button>
      </footer>
    </div>
  </div>
</template>
<script>
import bulmaCalendar from 'bulma-calendar'
import { getDailyMediaForTimeline, getDailyMediaForTimelineAndTimeRange } from '@/lib/TimelineService'
import * as sc from '@/store-constants'
import { mapState } from 'vuex'
import moment from 'moment'

let calendar = null
export default {
  name: 'RenderTimeSpanDialog',
  data: function () {
    return {
      selectedTab: 'whole',
      startDate: null,
      endDate: null
    }
  },
  mounted () {
    calendar = bulmaCalendar.attach(this.$refs.calendarTrigger, {
      type: 'date',
      isRange: true,
      dateFormat: 'DD.MM.YYYY',
      displayMode: 'dialog',
      showFooter: false
    })[0]
    calendar.on('select', (e) => {
      this.startDate = e.data.startDate
      this.endDate = e.data.endDate
    })
    calendar.on('clear', (e) => {
      this.startDate = null
      this.endDate = null
    })
  },
  computed: {
    ...mapState([
      'appState'
    ]),
    isVisible () {
      return this.appState === sc.APP_STATE_CHOOSE_RENDER_TIME_SPAN
    },
    acceptButtonEnabled () {
      return this.selectedTab !== 'custom' || (this.startDate !== null && this.endDate !== null)
    }
  },
  methods: {
    tabSelected (tab) {
      return tab === this.selectedTab
    },
    selectTab (tab) {
      this.selectedTab = tab
    },
    cancel () {
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    },
    accept () {
      // Set name from timeline plus date range
      let mediaFiles = []
      let startDate = null
      let endDate = null
      switch (this.selectedTab) {
        case 'whole':
          mediaFiles = getDailyMediaForTimeline(this.$store.state.currentTimeline)
          break
        case 'month':
          startDate = moment({ year: this.$store.state.currentYear, month: this.$store.state.currentMonth, day: 1 })
          endDate = moment({ year: this.$store.state.currentYear, month: this.$store.state.currentMonth + 1, day: 1 }).subtract(1, 'day')
          console.log('month: ' + startDate.format('YYYY-MM-DD') + ' ' + endDate.format('YYYY-MM-DD'))
          mediaFiles = getDailyMediaForTimelineAndTimeRange(this.$store.state.currentTimeline, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
          break
        case 'year':
          startDate = moment({ year: this.$store.state.currentYear, month: 0, day: 1 })
          endDate = moment({ year: this.$store.state.currentYear, month: 11, day: 31 })
          console.log('year:  ' + startDate.format('YYYY-MM-DD') + endDate.format('YYYY-MM-DD'))
          mediaFiles = getDailyMediaForTimelineAndTimeRange(this.$store.state.currentTimeline, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
          break
        case 'custom':
          startDate = moment({ year: this.startDate.getFullYear(), month: this.startDate.getMonth(), day: this.startDate.getDate() })
          endDate = moment({ year: this.endDate.getFullYear(), month: this.endDate.getMonth(), day: this.endDate.getDate() })
          console.log('custom:  ' + startDate.format('YYYY-MM-DD') + endDate.format('YYYY-MM-DD'))
          mediaFiles = getDailyMediaForTimelineAndTimeRange(this.$store.state.currentTimeline, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
          break
      }
      if (mediaFiles.length === 0) {
        return// TODO this should trigger a little warning saying: no files selected
      }
      const filePath = ipcRenderer.sendSync('show-save-dialog')
      if (filePath === null) {
        return
      }

      ipcRenderer.send('start-rendering', filePath, mediaFiles)
    }
  }
}
</script>
<style>
@import "~bulma-calendar/dist/css/bulma-calendar.min.css";
</style>
