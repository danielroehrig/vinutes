<template>
  <div class="modal" :class="{'is-active': isTimelineCreationModalShown }" id="timelineCreationDialog">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">Create a new timeline</label>
          <div class="control">
            <label>Enter a unique name for the new timeline
              <input v-model="newTimelineName" class="input" type="text"
                     placeholder="Enter name of the timeline">
            </label>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" @click="createNewTimeline">Submit</button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="cancelTimelineCreation">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="cancelTimelineCreation"></button>
  </div>
</template>
<script>
import * as sc from '@/store-constants'
import { createNewTimeline, getAllTimelines } from '@/lib/TimelineService'
export default {
  name: 'TimelineCreationDialog',
  data: function () {
    return {
      newTimelineName: null
    }
  },
  computed: {
    isTimelineCreationModalShown () {
      return this.$store.state.appState === sc.APP_STATE_CREATE_TIMELINE
    }
  },
  methods: {
    hide: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW) // TODO: Not unknown
    },
    cancelTimelineCreation: function () {
      this.hide()
    },
    createNewTimeline: function () {
      const timelineId = createNewTimeline(this.newTimelineName)
      this.$store.dispatch('loadTimelines')
      this.$store.dispatch('changeTimeline', timelineId)
      this.newTimelineName = null
    }
  }
}
</script>
