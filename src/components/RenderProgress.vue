<template>
    <b-modal :can-cancel=false :width=480 v-model="isActive">
        <div class="card">
          <div v-if="currentImage" class="card-image">
              <b-image
                  :src="currentImage"
              ></b-image>

          </div>
          <div class="card-content">
            <h3 class="card-header-title">{{ $t('render-progress') }}</h3>
            <b-progress type="is-primary" :value="renderProgress" show-value format="percent"></b-progress>
          </div>
          <footer class="card-footer">
            <div class="card-footer-item">
              <b-button type="is-danger is-light" @click="cancelRendering">{{ $t('button.cancel') }}</b-button>
            </div>
          </footer>
        </div>
    </b-modal>
</template>
<script>
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
      ipcRenderer.send('cancel-rendering')
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
