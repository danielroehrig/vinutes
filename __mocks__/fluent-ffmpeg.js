const EventEmitter = require('events').EventEmitter
const util = require('util')

function FfmpegCommand () {
  if (!(this instanceof FfmpegCommand)) {
    return new FfmpegCommand()
  }
  EventEmitter.call(this)
}
util.inherits(FfmpegCommand, EventEmitter)

FfmpegCommand.setFfmpegPath = function (path) {
  return null
}
FfmpegCommand.prototype.addInput = function () { return this }
FfmpegCommand.prototype.seekInput = function () { return this }
FfmpegCommand.prototype.loop = function () { return this }
FfmpegCommand.prototype.duration = function () { return this }
FfmpegCommand.prototype.videoFilters = function () { return this }
FfmpegCommand.prototype.size = function () { return this }
FfmpegCommand.prototype.fps = function () { return this }
FfmpegCommand.prototype.videoBitrate = function () { return this }
FfmpegCommand.prototype.videoCodec = function () { return this }
FfmpegCommand.prototype.autopad = function () { return this }
FfmpegCommand.prototype.output = function () { return this }
FfmpegCommand.prototype.setOutputParameters = function () { return this }
FfmpegCommand.prototype.mergeToFile = jest.fn()
FfmpegCommand.prototype.run = jest.fn()

module.exports = FfmpegCommand
