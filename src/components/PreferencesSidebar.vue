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
      <div class="m-4">
        <img
            src="img/heartlogo_slogan.png"
            class="mb-4"
        />
        <b-menu>
          <b-menu-list :label="$t('preferences')">
              <b-field :label="$t('language')">
              <b-select v-model="language" :placeholder="$t('language')" id="preferences-language-select">
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </b-select>
            </b-field>
            <b-field :label="$t('timestamp-format')">
              <b-input v-model="timestampFormat"></b-input>
            </b-field>
            <b-button type="is-primary" @click="close">{{ $t('button.accept') }}</b-button>
          </b-menu-list>
        </b-menu>
      </div>
      <footer class="footer">
        <div class="content">
          <p class="has-text-weight-light is-size-7">Version 0.3.4 - 2021-11-13</p>
          <p>
            <strong>Vinutes</strong> by <a href="https://github.com/danielroehrig" target="_blank">Daniel Röhrig</a>. The
            <a href="https://github.com/danielroehrig/vinutes" target="_blank">source code</a> is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
        </div>
      </footer>
    </b-sidebar>
  </section>
</template>
<script>
export default {
  props: {
    open: Boolean
  },
  computed: {
    language: {
      set (language) {
        this.$store.commit('changeLanguage', language)
        window.ipc.switchLanguage(language)
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
<style scoped>
  .footer{
    position: absolute;
    bottom: 0;
  }
</style>
