const { app } = require('electron')
const path = require('path')
const os = require('os')
let ffmpegPath = null
const FfmpegCommand = require('fluent-ffmpeg')
switch (os.type()) {
  case 'Linux':
    ffmpegPath = path.join(app.getAppPath(), '..', 'bin', 'amd64', 'ffmpeg')
    break
  case 'Windows_NT':
    ffmpegPath = path.join(app.getAppPath(), '..', 'bin', 'win64', 'ffmpeg.exe')
    FfmpegCommand.setFfprobePath(path.join(app.getAppPath(), '..', 'bin', 'win64', 'ffprobe.exe'))
    break
  case 'Darwin':
    ffmpegPath = path.join(app.getAppPath(), '..', 'bin', 'macos', 'ffmpeg')
    FfmpegCommand.setFfprobePath(path.join(app.getAppPath(), '..', 'bin', 'macos', 'ffprobe'))
    break
}
FfmpegCommand.setFfmpegPath(ffmpegPath)

const availableFormats = new Promise((resolve) => {
  FfmpegCommand.getAvailableFormats(function (err, formats) {
    if (err !== null) {
      log.error('FFMPEG: could not get available formats')
      app.exit(1)
    }
    resolve(formats)
  })
})
const availableCodecs = new Promise((resolve) => {
  FfmpegCommand.getAvailableCodecs(function (err, formats) {
    if (err !== null) {
      log.error('FFMPEG: could not get available codecs')
      app.exit(1)
    }
    resolve(formats)
  })
})

const probeVideo = (filePath) => {
  return new Promise((resolve, reject) => {
    console.log(filePath)
    FfmpegCommand()
      .input(filePath)
      .ffprobe(function (err, metadata) {
        console.log('Video Checker')
        console.log('err: ' + err)
        console.dir(metadata)
        if (err !== null) {
          reject(err)
        } else {
          resolve(metadata)
        }
      })
  })
}

const assertVideoSupported = async (event, filePath) => {
  const codecs = await availableCodecs

  function compareMediaDataWithAvailableCodecs (metadata, codecs) {
    console.log('here be metadata' + JSON.stringify(metadata))
    const videoStreams = metadata.streams.filter(stream => {
      return stream.codec_type === 'video'
    })
    if (videoStreams.length === 0) {
      log.debug('No video stream found')
      event.returnValue = null
    }
    // I just assume, that the video will be the FIRST found video stream
    const codecName = videoStreams[0].codec_name
    event.returnValue = Object.keys(codecs).includes(codecName)
  }

  probeVideo(filePath)
    .then(
      (metadata) => compareMediaDataWithAvailableCodecs(metadata, codecs)
    ).catch(err => {
      log.debug(err)
      event.returnValue = null
    })
}

module.exports.assertVideoSupported = assertVideoSupported
