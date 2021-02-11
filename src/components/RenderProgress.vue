<template>
    <b-modal :can-cancel=false v-model="isActive">
        <div class="card">
          <div v-if="currentImage" class="card-image">
              <b-image
                  :src="currentImage"
              ></b-image>

          </div>
          <div class="card-content">
            <h3 class="card-header-title">Render Progress</h3>
            <b-progress type="is-primary" :value="renderProgress" show-value format="percent"></b-progress>
          </div>
          <footer class="card-footer">
            <div class="card-footer-item">
              <b-button type="is-danger is-light" @click="cancelRendering">Cancel</b-button>
            </div>
          </footer>
        </div>
    </b-modal>
</template>
<script>
import * as sc from '@/store-constants'
export default {
  name: 'RenderProgress',
  props: {
    isActive: Boolean
  },
  computed: {
    renderProgress () {
      return this.$store.state.renderPercentage
    },
    currentImage () {
      return this.$store.state.renderCurrentDailyMedia ? 'data:image/jpg;base64,' + this.$store.state.renderCurrentDailyMedia.previewImage : null
    }
  },
  methods: {
    cancelRendering () {
      this.$store.commit('changeAppState', sc.APP_STATE_UNKNOWN)// TODO: Render Progress
    }
  }
}
</script>

<style scoped>
    .columns{
        overflow: hidden;
    }
    .modal-content{
        overflow: hidden;
    }
    button.modal-close {
      display: none;
    }
</style>
