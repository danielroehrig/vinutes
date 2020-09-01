<template>
  <div class="modal" :class="{'is-active': isTimelineCreationModalShown }" id="timelineCreationDialog">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">{{ $t('action.create-new-project') }}</label>
          <div class="control">
            <label>{{ $t('text.enter-unique-name-for-timeline')}}
              <input v-model="newTimelineName" class="input" type="text" ref="inputName" id="timelineCreationDialogInputTimelineName"
                     :placeholder="$t('placeholder.enter-new-timeline-name')" v-on:keyup.enter="createNewTimeline">
            </label>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link" @click="createNewTimeline" id="timelineCreationDialogButtonSubmit" :disabled="!isNameAcceptable">{{ $t('button.accept') }}</button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="cancelTimelineCreation" id="timelineCreationDialogButtonCancel">{{ $t('button.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="cancelTimelineCreation" id="timelineCreationDialogButtonClose"></button>
  </div>
</template>
<script>
import * as sc from '@/store-constants'
import { createNewTimeline } from '@/lib/TimelineService'
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
    },
    isNameAcceptable () {
      // TODO: check for timelines with the same name
      if (this.newTimelineName === null) {
        return false
      }
      return this.newTimelineName.trim().length > 0
    }
  },
  methods: {
    hide: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    },
    clearTimelineName: function () {
      this.newTimelineName = null
    },
    cancelTimelineCreation: function () {
      this.clearTimelineName()
      this.hide()
    },
    createNewTimeline: function () {
      if (!this.isNameAcceptable) {
        // TODO: show error
        return
      }
      this.newTimelineName = this.newTimelineName.trim()
      const timelineId = createNewTimeline(this.newTimelineName)
      this.$store.dispatch('loadTimelines')
      this.$store.dispatch('changeTimeline', timelineId)
      this.clearTimelineName()
    }
  },
  watch: {
    isTimelineCreationModalShown (isVisible, wasVisible) {
      if (isVisible && !wasVisible) {
        this.$nextTick(() => {
          this.$refs.inputName.focus()
        })
      }
    }
  }
}
</script>
