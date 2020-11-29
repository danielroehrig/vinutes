<template>
  <section>
    <b-sidebar
        type="is-light"
        :fullheight=true
        :fullwidth=false
        :overlay=true
        :right=true
        :on-cancel="close"
        :open="visible"
    >
      <div class="container mt-4">
        <h1 class="subtitle">{{ $t('preferences') }}</h1>
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
          <label class="label">{{ $t("timestamp-format") }}</label>
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
    },
    visible: function () {
      return this.open
    }
  },
  methods: {
    close: function () {
      this.$emit('closePreferences')
    }
  }
}
</script>
