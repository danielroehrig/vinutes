<template>
  <div class="modal" :class="{'is-active': isTimelineCreationModalShown }" id="timelineCreationDialog">
    <div class="modal-background"></div>
    <div class="modal-content" style="width: 80%">
      <div class="box">
        <div class="field">
          <label class="label">{{ $t('action.create-new-project') }}</label>
          <div class="control">
            <label>{{ $t('text.enter-unique-name-for-timeline') }}
              <input v-model="newTimelineName" class="input" type="text" ref="inputName"
                     id="timelineCreationDialogInputTimelineName"
                     :placeholder="$t('placeholder.enter-new-timeline-name')" v-on:keyup.enter="createNewTimeline">
            </label>
          </div>
        </div>
        <div class="notification is-danger" v-if="!nameAvailable" id="timelineCreationDialogNameWarning">
          {{ $t('text.name-in-use') }}
        </div>
        <div class="notification is-danger" v-if="null!==errorMessage" id="timelineCreationDialogErrorMessage">
          <button class="delete" @click="clearErrorMessage"></button>
          {{ errorMessage }}
        </div>
        <div class="field is-grouped">
          <b-button type="is-primary mr-3" @click.native="createNewTimeline" id="timelineCreationDialogButtonSubmit"
                      :disabled="!isNameAcceptable">{{ $t('button.accept') }}</b-button>
          <b-button @click.native="cancelTimelineCreation"
                    id="timelineCreationDialogButtonCancel">{{ $t('button.cancel') }}</b-button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="cancelTimelineCreation"
            id="timelineCreationDialogButtonClose"></button>
  </div>
</template>
<script>
import * as sc from '@/store-constants'
import { createNewTimeline } from '@/lib/TimelineService'

export default {
  name: 'TimelineCreationDialog',
  data: function () {
    return {
      newTimelineName: null,
      errorMessage: null
    }
  },
  computed: {
    isTimelineCreationModalShown () {
      return this.$store.state.appState === sc.APP_STATE_CREATE_TIMELINE
    },
    nameAvailable () {
      return this.isNameAvailable()
    },
    isNameAcceptable () {
      return (
        this.newTimelineName !== null &&
        this.newTimelineName.trim().length > 0 &&
        this.isNameAvailable())
    }
  },
  methods: {
    leaveTimelineCreationState: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    },
    clearTimelineName: function () {
      this.newTimelineName = null
    },
    cancelTimelineCreation: function () {
      this.clearTimelineName()
      this.leaveTimelineCreationState()
      this.$refs.inputName.blur()
      this.clearErrorMessage()
    },
    createNewTimeline: function () {
      if (!this.isNameAcceptable) {
        return
      }
      this.newTimelineName = this.newTimelineName.trim()
      try {
        const timelineId = createNewTimeline(this.newTimelineName)
        this.$store.dispatch('loadTimelines')
        this.$store.dispatch('changeTimeline', timelineId)
      } catch (error) {
        // TODO: Log to electron-log and/or to some cloud based error handler
        this.errorMessage = this.$t('error.create-timeline-error')
        return
      }
      this.clearTimelineName()
    },
    clearErrorMessage: function () {
      this.errorMessage = null
    },
    isNameAvailable: function () {
      return !this.$store.getters.timelineNames.includes(this.newTimelineName)
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
