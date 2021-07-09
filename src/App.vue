<template>
  <div id="app">
    <Navbar v-on:openPreferences="openPreferences()"></Navbar>
    <Preferences v-bind:open="this.showPreferences" v-on:closePreferences="closePreferences()"></Preferences>
    <Calendar></Calendar>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
<script>
import Navbar from './components/Navbar'
import { initDBStructure } from './lib/PersistenceService'
import { mapState } from 'vuex'
import * as sc from '@/store-constants'
import Calendar from '@/components/calendar/Calendar'
import Preferences from '@/components/Preferences'

export default {
  components: { Preferences, Calendar, Navbar },
  data: function () {
    return {
      showPreferences: false
    }
  },
  // Before any window is created, load database structure
  beforeCreate () {
    // TODO Migration comes here
    initDBStructure()
  },
  computed: mapState(['appState', 'currentYear', 'currentMonth', 'currentDaySelected', 'language']),
  // As soon as app is ready, load the last saved state
  mounted () {
    this.$store.dispatch('loadTimelines')
    this.$store.dispatch('loadLastState')
  },
  methods: {
    closePreferences: function () {
      this.showPreferences = false
    },
    openPreferences: function () {
      this.showPreferences = true
    }
  },
  watch: {
    language (newState, oldState) {
      this.$i18n.locale = newState
    },
    /**
     * State machine handler
     * @param {string} newState
     * @param {string} oldState
     */
    appState (newState, oldState) {
      switch (newState) {
        // Open media file chooser
        case sc.APP_STATE_CHOOSE_MEDIA_FILE:
        {
          // This is confusing, but basically, momentjs uses zero-based months while in the database January starts with 1
          const oneBasedMonthNumeral = this.currentMonth + 1
          const dailyMedia = ipcRenderer.sendSync('show-open-dialog', this.currentYear, oneBasedMonthNumeral, this.currentDaySelected)
          if (dailyMedia === null) {
            this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
            return
          }
          if (dailyMedia.mediaType === 'image') {
            ipcRenderer.send('render-image-preview', dailyMedia)
            return
          }
          this.$store.commit('setCurrentDailyMedia', dailyMedia)
          this.$store.commit('changeAppState', sc.APP_STATE_VIDEO_PLAYER)
          break
        }
        default:
          console.log('State changed unknown')
      }
    }
  }
}
</script>
