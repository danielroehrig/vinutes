<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="columns">
                <div class="column">
                    <b-progress class="progress is-primary" :value="renderProgress" show-value format="percent"></b-progress>
                </div>
            </div>
            <div class="columns">
                <div class="column"><button class="button" value="Cancel" @click="cancelRendering">Cancel</button></div>
            </div>
        </div>
        <button class="modal-close is-large"></button>
    </div>
</template>
<script>
import * as sc from '@/store-constants'
export default {
  name: 'RenderProgress',
  computed: {
    renderProgress () {
      return this.$store.state.renderPercentage
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
</style>
