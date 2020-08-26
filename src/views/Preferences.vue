<template>
    <div class="container">
        <div class="field has-text-left">
            <label class="label">Language</label>
            <div class="control">
                <div class="select">
                    <select v-model="language">
                        <option value="de">Deutsch</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="field has-text-left">
            <label class="label">Timestamp format</label>
            <div class="control">
                    <input class="input" type="text" v-model="timestampFormat">
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Preferences',
  computed: {
    language: {
      set (language) {
        this.$store.commit('changeLanguage', language)
        ipcRenderer.send('update-config', 'language', language)
      },
      get () {
        return this.$store.state.language
      }
    },
    timestampFormat: {
      set (timestampFormat) {
        this.$store.commit('changeTimestampFormat', timestampFormat)
      },
      get () {
        return this.$store.state.calendarTimeStampFormat
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
