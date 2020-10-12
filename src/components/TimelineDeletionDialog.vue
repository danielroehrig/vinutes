<template>
  <section class="modal is-active" id="timelineDeletionDialog">
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
    deleteButtonEnabled: function () {
      return this.confirmedTimelineName === this.currentTimelineName
    }
  },
  methods: {
    deleteTimeline: function () {
      console.log('delete me')
    },
    cancel: function () {
      this.$store.state.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    }
  }
}
</script>
