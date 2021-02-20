<template>
  <section>
    <b-navbar type="is-dark" :mobile-burger=false>
      <template v-slot:brand>
        <b-navbar-item>
          <img src="img/heartlogo.png">
        </b-navbar-item>
      </template>
      <template v-slot:start>
        <b-navbar-item v-if="isCurrentTimelineEmpty">
          <b-button type="is-primary" @click="showTimelineCreationModal">{{
              $t('action.create-new-project')
            }}
          </b-button>
        </b-navbar-item>
        <MenuTimelineSelector v-if="!isCurrentTimelineEmpty" :timelines="timelines" :currentTimeline="currentTimeline"
                              v-on:setTimeline="setTimeline"
                              v-on:showTimelineCreationModal="showTimelineCreationModal"
                              v-on:showTimelineDeletionModal="showTimelineDeletionModal">

        </MenuTimelineSelector>
      </template>
      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button type="is-primary" @click="renderCurrentTimeline">
              <strong>Render</strong>
            </b-button>
            <b-button type="is-light" class="mdi mdi-24px mdi-cog" @click="showPreferences()"></b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <TimelineCreationDialog/>
    <TimelineDeletionDialog v-bind:current-timeline-name="currentTimelineName"/>
    <RenderTimeSpanDialog/>
    <RenderProgress :is-active="isStateRendering"></RenderProgress>
  </section>
</template>

<script>
import { loadTimeline } from '@/lib/TimelineService'
import RenderProgress from './RenderProgress'
import TimelineCreationDialog from '@/components/timeline/TimelineCreationDialog'
import * as sc from '@/store-constants'
import RenderTimeSpanDialog from '@/components/timeline/RenderTimelineDialog'
import TimelineDeletionDialog from '@/components/timeline/TimelineDeletionDialog'
import MenuTimelineSelector from '@/components/timeline/MenuTimelineSelector'

export default {
  name: 'Navbar',
  components: {
    MenuTimelineSelector,
    TimelineDeletionDialog,
    RenderTimeSpanDialog,
    TimelineCreationDialog,
    RenderProgress
  },
  computed: {
    timelines: function () {
      return this.$store.state.timelines
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
    isStateRendering () {
      return this.$store.state.appState === sc.APP_STATE_RENDERING_TIMELINE
    },
    isCurrentTimelineEmpty: function () {
      return this.timelines.length === 0 || this.currentTimeline === null
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
    },
    showPreferences: function () {
      this.$emit('openPreferences')
    }
  }
}
</script>
