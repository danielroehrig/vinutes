<template>
<b-modal :active=isVisible :on-cancel=close>
  <p class="image"><img :src=imageSrc class="src"></p>
</b-modal>
</template>

<script>
import * as sc from '@/store-constants'

export default {
  computed: {
    isVisible () {
      return this.$store.state.appState === sc.APP_STATE_IMAGE_VIEWER
    },
    imageSrc () {
      return this.$store.state.currentDailyMediaShown !== null ? 'file://' + this.$store.state.currentDailyMediaShown.filePath : null
    }
  },
  methods: {
    close () {
      this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW)
    }
  }
}
</script>

<style scoped>

</style>
