<template>
  <b-navbar-dropdown :label="currentTimeline.name">
    <b-navbar-item v-for="timeline in otherTimelines" :key="timeline.id" @click="$emit('setTimeline', timeline.id)">
  {{ timeline.name }}
    </b-navbar-item>
      <b-navbar-item @click="$emit('showTimelineCreationModal')">
        <b-icon icon="plus" size="is-small" class="pr-4"></b-icon>
        {{ $t('action.create-new-project') }}
      </b-navbar-item>
      <b-navbar-item class="has-text-danger" @click="$emit('showTimelineDeletionModal')">
          <b-icon icon="delete" size="is-small" class="pr-4"></b-icon>
         {{ $t('action.delete-current-project') }}
      </b-navbar-item>
  </b-navbar-dropdown>
</template>
<script>
export default {
  name: 'MenuTimelineSelector',
  props: {
    currentTimeline: Object,
    timelines: Array
  },
  computed: {
    otherTimelines: function () {
      return this.timelines.filter(e => e.id !== this.currentTimeline.id)
    }
  }
}
</script>
