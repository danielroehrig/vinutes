import { shallowMount } from '@vue/test-utils'
import TimelineCreationDialog from '@/components/TimelineCreationDialog.vue'
import Vuex from 'vuex'
import Vue from 'vue'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import i18n from '@/i18n'

chai.use(sinonChai)
Vue.use(Vuex)

const expect = chai.expect

describe('TimelineCreationDialog.vue', () => {
  it('empty name disables submit button', () => {
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        currentMonth: 11,
        currentYear: 2018,
        currentDaySelected: null
      }
    }
    )
    const wrapper = shallowMount(TimelineCreationDialog, {
      store: store,
      i18n
    })
    wrapper.setData({ newTimelineName: null })
    const submitButton = wrapper.get('#timelineCreationDialogButtonSubmit')
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    expect(submitButton.attributes()).has.property('disabled')
    input.setValue('a')
    expect(submitButton.attributes()).has.not.property('disabled')
    input.setValue(' ')
    expect(submitButton.attributes()).has.property('disabled')
  })
  it('cancel clears name', () => {
    const store = new Vuex.Store({
      state: {
        mediaFiles: {},
        currentMonth: 11,
        currentYear: 2018,
        currentDaySelected: null
      }
    }
    )
    const wrapper = shallowMount(TimelineCreationDialog, {
      store: store,
      i18n
    })
    wrapper.setData({ newTimelineName: null })
    const input = wrapper.get('#timelineCreationDialogInputTimelineName')
    const cancelButton = wrapper.get('#timelineCreationDialogButtonCancel')
    input.setValue('New Timeline Name')
    wrapper.vm.$nextTick()
    expect(input.element.value).equals('New Timeline Name')
    cancelButton.trigger('click')
    wrapper.vm.$nextTick()
    expect(input.element.value).equals('hallo')
  })
  // TODO Return submits timeline
  // it('cancel clears name', () => {
  // TODO Focus on app status change
  // TODO duplicate timeline names
  // TODO submit writes to database
  // TODO Database says no (title too long, collision, whatevs)
})
