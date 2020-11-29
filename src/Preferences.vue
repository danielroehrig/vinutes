<template>
  <section>
    <b-sidebar
        type="is-light"
        :fullheight="fullheight"
        :fullwidth="fullwidth"
        :overlay="overlay"
        :right="right"
        v-model="open"
        :on-cancel="close"
    >
      <div class="container mt-4">
        <h1 class="subtitle">Preferences</h1>
        <div class="field has-text-left">
          <label class="label" for="preferences-language-select">{{ $t('language') }}</label>
          <div class="control">
            <div class="select">
              <select v-model="language" id="preferences-language-select">
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
        <div class="control mt-4">
          <button class="button is-primary" @click="close">{{ $t('button.accept') }}</button>
        </div>
      </div>
    </b-sidebar>
  </section>
</template>
<script>
export default {
  name: 'Preferences',
  props: {
    open: Boolean
  },
  data () {
    return {
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: true
    }
  },
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
  methods: {
    close: function () {
      this.$emit('closePreferences')
    }
  }
}
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
