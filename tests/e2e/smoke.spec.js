import testWithSpectron from 'vue-cli-plugin-electron-builder/lib/testWithSpectron'
const spectron = require('spectron')
jest.setTimeout(50000)

describe('Application launch', function () {
  it('opens a window', async function () {
    const { stopServe, app } = await testWithSpectron(spectron, { env: { RUNNING_IN_SPECTRON: 1 } })
    // app is a spectron instance. It is attached to the dev server, launched, and waited for to load.
    expect(await app.client.getWindowCount()).toBe(1)

    const thirdDay = await app.client.$('#calendarDay3')
    await thirdDay.click()
    const timelineInput = await app.client.$('#timelineCreationDialogInputTimelineName')
    await timelineInput.setValue('New Timeline')
    const timelineAcceptButton = await app.client.$('#timelineCreationDialogButtonSubmit')
    await timelineAcceptButton.click()

    const navbar = await app.client.$$('a.navbar-link')
    expect(await navbar[0].getText()).toBe('New Timeline')
    await thirdDay.click()
    const acceptVideoButton = await app.client.$('#videoPlayerAcceptButton')
    await acceptVideoButton.click()
    const thirdDayWithMedia = await app.client.$('#calendarDay3.withMedia')
    await thirdDayWithMedia.waitForExist({})
    const ninthDay = await app.client.$('#calendarDay9')
    await ninthDay.click()
    await acceptVideoButton.click()
    const navbarRenderButton = await app.client.$('#navbarRenderButton')
    await navbarRenderButton.click()

    // Before your tests end, make sure to stop the dev server and spectron
    await stopServe()
  })
})
