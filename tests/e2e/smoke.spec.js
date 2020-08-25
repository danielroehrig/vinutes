import testWithSpectron from 'vue-cli-plugin-electron-builder/lib/testWithSpectron'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
const spectron = __non_webpack_require__('spectron')

chai.should()
chai.use(chaiAsPromised)

describe('Application launch', function () {
    this.timeout(30000)

    beforeEach(function () {
        return testWithSpectron(spectron).then(instance => {
            this.app = instance.app
            this.stopServe = instance.stopServe
        })
    })

    beforeEach(function () {
        chaiAsPromised.transferPromiseness = this.app.transferPromiseness
    })

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.stopServe()
        }
    })

    it('opens a window', function () {
        return this.app.client
            .getWindowCount()
            .should.eventually.have.at.least(1);
    })

    it('does not have the developer tools open', function () {
        const devToolsAreOpen = this.app.client
            .browserWindow.isDevToolsOpened();
        return devToolsAreOpen.should.eventually.be.false;
    });
})