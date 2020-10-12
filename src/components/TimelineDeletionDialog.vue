<template>
  <section class="modal"  :class="{'is-active': isVisible}" id="timelineDeletionDialog">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head has-background-danger">
        <p class="modal-card-title has-text-white"><i class="mdi mdi-alert"></i> {{
          $t('action.delete-current-project')
          }}</p>
      </header>
      <section class="modal-card-body">
        <div class="field"><label class="label">{{ $t('action.confirm-deletion-of-timeline-by-entering-name') }}
          <input v-model="confirmedTimelineName" class="input" type="text" ref="inputName"
                 id="timelineDeletionDialogInputTimelineName"
                 :placeholder="$t('placeholder.confirm-timeline-name')"></label></div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="cancel">{{ $t('button.cancel') }}</button>
        <button class="button is-danger" @click="deleteTimeline" :disabled="!deleteButtonEnabled">{{
          $t('button.delete')
          }}
        </button>
      </footer>
    </div>
  </section>
</template>
<script>
import * as sc from '@/store-constants'
export default {
  props: {
    currentTimelineName: String
  },
  data: function () {
    return {
      confirmedTimelineName: ''
    }
  },
  name: 'TimelineDeletionDialog',
  computed: {
    isVisible: function () {
      return this.$store.state.appState === sc.APP_STATE_CONFIRM_TIMELINE_DELETE
    },
    deleteButtonEnabled: function () {
      return this.confirmedTimelineName === this.currentTimelineName
    }
  },
  methods: {
    deleteTimeline: function () {
      this.$store.dispatch('deleteCurrentTimeline')
    },
    cancel: function () {
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    }
  }
}
</script>
