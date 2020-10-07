<template>
  <div class="modal" :class="{'is-active': isVisible}" id="deleteMediaDialog">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ $t('action.render-time-span') }}</p>
      </header>
      <section class="modal-card-body">
        <div class="tabs is-centered is-fullwidth is-toggle">
          <ul>
            <li :class="{'is-active': tabSelected('whole')}"><a @click="selectTab('whole')">{{ $t('whole-time-line') }}</a></li>
            <li :class="{'is-active': tabSelected('month')}"><a @click="selectTab('month')">{{ $t('month') }}</a></li>
            <li :class="{'is-active': tabSelected('year')}"><a @click="selectTab('year')">{{ $t('year') }}</a></li>
            <li :class="{'is-active': tabSelected('custom')}"><a @click="selectTab('custom')">{{ $t('custom') }}</a></li>
          </ul>
        </div>
        <div :class="{'is-hidden': !tabSelected('whole')}">
          <i>{{ $t('text.render-whole-timeline') }}</i>
        </div>
        <div :class="{'is-hidden': !tabSelected('month')}">
          <i>{{ $t('text.render-current-month') }}</i>
        </div>
        <div :class="{'is-hidden': !tabSelected('year')}">
          <i>{{ $t('text.render-current-year') }}</i>
        </div>
        <div class="field" :class="{'is-hidden': !tabSelected('custom')}">
          <div class="control">
            <input type="date" id="renderTimeSpanDialogDateSpanChooser" ref='calendarTrigger'>
            <i>{{ $t('text.render-custom') }}</i>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button">{{ $t('button.cancel') }}</button>
        <button class="button is-success">{{ $t('button.render') }}</button>
      </footer>
    </div>
  </div>
</template>
<script>
import bulmaCalendar from 'bulma-calendar'

export default {
  name: 'RenderTimeSpanDialog',
  data: function () {
    return {
      selectedTab: 'whole'
    }
  },
  mounted () {
    const calendar = bulmaCalendar.attach(this.$refs.calendarTrigger, {
      type: 'date',
      isRange: true,
      dateFormat: 'DD.MM.YYYY',
      displayMode: 'dialog',
      showFooter: false
    })[0]
    calendar.on('select', e => console.log('gna'))
  },
  computed: {
    isVisible () {
      return true
    }
  },
  methods: {
    tabSelected (tab) {
      return tab === this.selectedTab
    },
    selectTab (tab) {
      this.selectedTab = tab
    }
  }
}
</script>
<style>
@import "~bulma-calendar/dist/css/bulma-calendar.min.css";

/*.datepicker-nav, .datepicker-range{
  background: red!important;
}
.datetimepicker-selection-day, .datepicker-date.datepicker-range.datepicker-range-start {
  color: red!important;
}
div.datepicker-range-start{
  background: red!important;
}
div.datepicker-range > button {
  background: red!important;
}

div.datepicker-range-start > button, div.datepicker-range-end > button {
  border-color: red!important;
  color: red!important;
  background: white!important;
}*/
</style>
