import store from '../../../src/store'
import * as sc from '../../../src/store-constants'
describe('Store actions when a calendar day is clicked', () => {
  it('opens dialog if no mediafile is set', async () => {
    await store.dispatch('calendarDayClicked', 7)
    expect(store.state.appState).toEqual(sc.APP_STATE_CREATE_TIMELINE)
  })
})
