const { app } = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')
const fsPromises = require('fs').promises

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

function getMediaHeader (filePath) {
  return new Promise((resolve, reject) => {
    fsPromises.open(filePath, 'r')
      .then(fd => {
        const buffer = Buffer.alloc(16)
        return fd.read(buffer, 0, 16, 0)
      })
      .then((buffer) => {
        const mediaHeadHexCode = buffer.buffer.toString('hex')
        resolve(mediaHeadHexCode)
      })
      .catch(err => {
        reject(err)
      })
  })
}

function getMediaExtension (mediaHeadHexCode) {
  // GIF
  // 47 49 46 38 37 61
  // 47 49 46 38 39 61
  const mediaHeadHexCodeUpper = mediaHeadHexCode.toUpperCase()
  // The letter G gets repeated every 188 bytes and it CAN be a MPEG Transport Stream (MPEG-2 Part 1)
  if (mediaHeadHexCodeUpper.substr(0, 2) === '47') {
    return 'mpg'
  }
  let type = null
  switch (mediaHeadHexCodeUpper.substr(0, 8)) {
    // JPG:
    case 'FFD8FFDB':
    case 'FFD8FFE0':
    case 'FFD8FFEE':
    case 'FFD8FFE1':
      type = 'jpg'
      break
    // PNG
    case '89504E47':
      type = 'png'
      break
    // OGV
    case '4F676753':
      type = 'ogv'
      break
    // AVI
    case '52494646':
      if (mediaHeadHexCodeUpper.substr(16, 8) === '41564920') {
        type = 'avi'
      }
      break
    // MKV
    case '1A45DFA3':
      type = 'mkv'
      break
    // MPG
    case '000001BA':
    case '000001B3':
      type = 'mpg'
      break
    // MP4
    case '66747970':
      if (mediaHeadHexCodeUpper.substr(8, 8) === '69736F6D') {
        type = 'mp4'
      }
      break
  }
  return type
}

const getMediaTypeFromExtension = (extension) => {
  if (['mp4', 'mpg', 'mkv', 'avi', 'ogv'].includes(extension)) {
    return 'video'
  } else if (['jpg', 'png'].includes(extension)) {
    return 'image'
  }
  return null
}

module.exports.getMediaHeader = getMediaHeader
module.exports.getMediaExtension = getMediaExtension
module.exports.getMediaTypeFromExtension = getMediaTypeFromExtension
