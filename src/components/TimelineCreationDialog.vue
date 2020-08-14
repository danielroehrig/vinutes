<template>
  <div class="modal" :class="{'is-active': isTimelineCreationModalShown }" id="timelineCreationDialog">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input v-model="newTimelineName" class="input" type="text"
                   placeholder="Enter name of the timeline">
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
export default {
  name: "TimelineCreationDialog",
  props: {
    cancelTimelineCreation: {},
    createNewTimeline: {},
    isTimelineCreationModalShown: {},
    newTimelineName: {},
  },
};
</script>
