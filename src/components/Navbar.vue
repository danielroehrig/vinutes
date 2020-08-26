<template>
  <div>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <router-link to="/"><img src="img/shutterIcon.png" width="28" height="28"></router-link>
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
            <button class="button" @click="showTimelineCreationModal">Create new Timeline</button>
          </div>
          <div v-else-if="timelines.length === 1" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" v-bind:key="timelines[0].id">
              {{ timelines[0].name }}
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" @click="showTimelineCreationModal">
                Create new Timeline
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
                Create new Timeline
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary" @click="renderCurrentTimeline()">
                <strong>Render</strong>
              </a>
              <router-link to="/preferences">
                <span class="button mdi mdi-24px mdi-cog"></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <TimelineCreationDialog/>

    <RenderProgress v-if="this.$store.state.renderQueue.length>0 || this.$store.state.renderedQueue.length>0"
                    :progress="renderProgress"></RenderProgress>
  </div>
</template>

<script>
import { getAllTimelines, getDailyMediaForTimeline, loadTimeline } from '@/lib/TimelineService'
import RenderProgress from './RenderProgress'
import TimelineCreationDialog from '@/components/TimelineCreationDialog'
import * as sc from '@/store-constants'

export default {
  name: 'Navbar',
  components: { TimelineCreationDialog, RenderProgress },
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
    selectableTimelines: function () {
      return this.timelines.filter((timeline) => {
        return timeline.id !== this.currentTimeline.id
      })
    },
    renderProgress: function () {
      const renderQueueCount = this.$store.state.renderQueue.length + this.$store.state.renderedQueue.length
      if (renderQueueCount > 0) {
        return this.$store.state.renderedQueue.length / renderQueueCount * 100
      }
    }
  },
  methods: {
    setTimeline: function (id) {
      this.$store.dispatch('changeTimeline', id)
    },
    renderCurrentTimeline: function () {
      const filePath = ipcRenderer.sendSync('show-save-dialog')
      if (filePath === null) {
        return
      }
      this.$store.commit('setRenderOutputPath', filePath)
      const mediaFiles = getDailyMediaForTimeline(this.$store.state.currentTimeline)
      this.$store.dispatch('startRenderQueue', mediaFiles)
    },
    showTimelineCreationModal: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CREATE_TIMELINE)
    }
  }
}
</script>
