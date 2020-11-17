<template>
  <section>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <router-link to="/"><img src="img/heartlogo.png" width="28" height="28"></router-link>
        </div>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar" class="navbar-menu">
        <div class="navbar-start">
          <div v-if="(timelines.length === 0 || currentTimeline === null)" class="navbar-item">
            <button class="button" @click="showTimelineCreationModal">{{ $t('action.create-new-project') }}</button>
          </div>
          <div v-else-if="timelines.length === 1" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" v-bind:key="timelines[0].id">
              {{ timelines[0].name }}
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" @click="showTimelineCreationModal">
                {{ $t('action.create-new-project') }}
              </a>
              <a class="navbar-item has-text-danger" @click="showTimelineDeletionModal">
                <i class="mdi mdi-alert"></i> {{ $t('action.delete-current-project') }}
              </a>
            </div>
          </div>
          <div v-else class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              {{ currentTimeline.name }}
            </a>
            <div class="navbar-dropdown">
              <a v-for="timeline in selectableTimelines" v-bind:key="timeline.id" class="navbar-item"
                 @click="setTimeline(timeline.id)">
                {{ timeline.name }}
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item" @click="showTimelineCreationModal">
                {{ $t('action.create-new-project') }}
              </a>
              <a class="navbar-item has-text-danger" @click="showTimelineDeletionModal">
                <i class="mdi mdi-alert"></i> {{ $t('action.delete-current-project') }}
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <b-button type="is-primary" @click="renderCurrentTimeline()" id="navbarRenderButton">
                <strong>Render</strong>
              </b-button>
              <router-link to="/preferences">
                <span class="button mdi mdi-24px mdi-cog"></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <TimelineCreationDialog/>
    <TimelineDeletionDialog v-bind:current-timeline-name="currentTimelineName"/>
    <RenderTimeSpanDialog/>
    <RenderProgress v-if="this.$store.state.renderQueue.length>0 || this.$store.state.renderedQueue.length>0"
                    :progress="renderProgress"></RenderProgress>
  </section>
</template>

<script>
import { loadTimeline } from '@/lib/TimelineService'
import RenderProgress from './RenderProgress'
import TimelineCreationDialog from '@/components/TimelineCreationDialog'
import * as sc from '@/store-constants'
import RenderTimeSpanDialog from '@/components/RenderTimeSpanDialog'
import TimelineDeletionDialog from '@/components/TimelineDeletionDialog'

export default {
  name: 'Navbar',
  components: { TimelineDeletionDialog, RenderTimeSpanDialog, TimelineCreationDialog, RenderProgress },
  computed: {
    timelines: function () {
      const timelines = this.$store.state.timelines
      console.log(timelines)
      return timelines
    },
    currentTimeline: function () {
      const currentTimeline = this.$store.state.currentTimeline
      if (currentTimeline === null) {
        return null
      }
      return loadTimeline(currentTimeline)
    },
    currentTimelineName: function () {
      if (this.currentTimeline !== null) {
        return this.currentTimeline.name
      }
      return ''
    },
    selectableTimelines: function () {
      return this.timelines.filter((timeline) => {
        return timeline.id !== this.currentTimeline.id
      })
    },
    renderProgress: function () {
      const renderQueueCount = this.$store.state.renderQueue.length + this.$store.state.renderedQueue.length
      if (renderQueueCount <= 0) {
        return 0
      }
      return this.$store.state.renderedQueue.length / renderQueueCount * 100
    }
  },
  methods: {
    setTimeline: function (id) {
      this.$store.dispatch('changeTimeline', id)
    },
    renderCurrentTimeline: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CHOOSE_RENDER_TIME_SPAN)
    },
    showTimelineCreationModal: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CREATE_TIMELINE)
    },
    showTimelineDeletionModal: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CONFIRM_TIMELINE_DELETE)
    }
  }
}
</script>
