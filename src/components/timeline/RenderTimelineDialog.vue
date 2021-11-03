<template>
  <div class="modal" :class="{'is-active': isVisible}" id="renderTimelineDialog">
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
            <b-datepicker
                placeholder="Click to select..."
                v-model="dateRange"
                inline
                range
                :locale="language"
                v-on:range-start="rangeStart"
            >
            </b-datepicker>
          <i>{{ displayTimeRange }}</i>
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
import { getDailyMediaForTimeline, getDailyMediaForTimelineAndTimeRange } from '@/lib/TimelineService'
import * as sc from '@/store-constants'
import { mapState } from 'vuex'
import moment from 'moment'
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import localizedFormat from 'dayjs/plugin/localizedFormat'

export default {
  name: 'RenderTimeSpanDialog',
  data: function () {
    return {
      selectedTab: 'whole',
      startDate: null,
      endDate: null,
      dateRange: []
    }
  },
  computed: {
    ...mapState([
      'appState'
    ]),
    isVisible () {
      return this.appState === sc.APP_STATE_CHOOSE_RENDER_TIME_SPAN
    },
    acceptButtonEnabled () {
      return this.selectedTab !== 'custom' || this.dateRange.length === 2
    },
    displayTimeRange () {
      console.log('display setup')
      let dateRange = 'please select range'
      if (this.dateRange.length >= 2) {
        console.log('bigger 2')
        dayjs.locale(this.$store.state.language)
        dayjs.extend(localizedFormat)
        const startDate = dayjs(this.dateRange[0])
        const endDate = dayjs(this.dateRange[1])
        dateRange = (startDate.format('LL')) + ' - ' + endDate.format('LL')
      }
      console.log(dateRange)
      return dateRange
    },
    language () {
      return this.$store.state.language
    }
  },
  methods: {
    tabSelected (tab) {
      return tab === this.selectedTab
    },
    selectTab (tab) {
      this.selectedTab = tab
    },
    rangeStart () {
      console.log('Range Start')
      this.dateRange = []
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
          startDate = dayjs(this.dateRange[0])
          endDate = dayjs(this.dateRange[1])
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
.datepicker-header {
  border-bottom: none!important;
}
</style>
