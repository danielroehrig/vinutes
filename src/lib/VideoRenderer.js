const { app } = require('electron')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { spawn } = require('child_process')
let ffmpegPath = null
const silenceMP3Path = path.resolve(path.join(app.getAppPath(), '..', 'public', 'silence.mp3'))
const FfmpegCommand = require('fluent-ffmpeg')
const sharp = require('sharp')
const log = require('electron-log')
switch (os.type()) {
  case 'Linux':
    ffmpegPath = path.join(app.getAppPath(), '..', 'bin', 'amd64', 'ffmpeg')
    log.debug('OS detected as Linux')
    break
  case 'Windows_NT':
    ffmpegPath = path.join(app.getAppPath(), '..', 'bin', 'win64', 'ffmpeg.exe')
    FfmpegCommand.setFfprobePath(path.join(app.getAppPath(), '..', 'bin', 'win64', 'ffprobe.exe'))
    log.debug('OS detected as Windows')
    break
  case 'Darwin':
    ffmpegPath = path.join(app.getAppPath(), '..', 'bin', 'macos', 'ffmpeg')
    FfmpegCommand.setFfprobePath(path.join(app.getAppPath(), '..', 'bin', 'macos', 'ffprobe'))
    log.debug('OS detected as Darwin')
    break
}

let currentFFmpegCommand = null

FfmpegCommand.setFfmpegPath(ffmpegPath)

/**
 * Create screenshot from a video at the given time stamp from file path
 *
 * @param {DailyMedia} dailyMedia
 * @param {Timeline} timeline
 * @param {IpcMainEvent} event
 */
const createScreenshot = (dailyMedia, timeline, event) => {
  const screenshotName = `vinutes-${dailyMedia.year}${dailyMedia.month}${dailyMedia.day}.jpg`
  const screenshotRotatedName = `vinutes-${dailyMedia.year}${dailyMedia.month}${dailyMedia.day}Rotated.jpg`
  const tempFolder = app.getPath('temp')
  currentFFmpegCommand = new FfmpegCommand(dailyMedia.filePath).screenshots({
    timestamps: [dailyMedia.timeStamp],
    filename: screenshotName,
    folder: tempFolder
  }).on('end', function () {
    console.log('screenshot created')
    const screenShotPath = path.join(tempFolder, screenshotName)
    const screenShotPathRotated = path.join(tempFolder, screenshotRotatedName)
    sharp(screenShotPath)
      .rotate(dailyMedia.rotation)
      .resize({ width: 320, height: 180, fit: 'contain' })
      .toFile(screenShotPathRotated)
      .then(data => {
        console.log('screenshot rotated')
        const buff = fs.readFileSync(screenShotPathRotated)
        dailyMedia.previewImage = buff.toString('base64')
        event.reply('screenshot-created', dailyMedia)
      }
      )
  }).on('error', function () {
    log.error('Could not create screenshot for ' + screenshotName)
  })
}

/**
 * Create and save a thumbnail of a given image
 * @param {DailyMedia} dailyMedia
 * @param {Event} event
 * @return {Promise<void>}
 */
const createImagePreview = (dailyMedia, event) => {
  sharp(dailyMedia.filePath)
    .rotate()
    .resize(320, 180, {
      fit: 'cover'
    })
    .jpeg()
    .toBuffer()
    .then((outputBuffer) => {
      dailyMedia.previewImage = outputBuffer.toString('base64')
      event.reply('screenshot-created', dailyMedia)
    })
    .catch(error => {
      log.error(
        'Could not create a thumbnail for the image ' + dailyMedia.filePath +
      ' with error ' + error.message)
    })
}

/**
 * Run the rendering process
 * @param filePath
 * @param dailyMediaObjects
 * @param tmpFolder
 * @param event
 * @return {Promise<string>} Resolves to the filename of the rendered video
 */
const run = (filePath, dailyMediaObjects, tmpFolder, event) => {
  return renderClips(filePath, dailyMediaObjects, tmpFolder, event)
    .then(
      () => {
        const filePaths = dailyMediaObjects.map(d => d.tmpFilePath)
        return mergeVideos(filePaths, filePath, tmpFolder, event)
      }
    )
    .catch(error => {
      log.error('Video render process failed with error: ' + error.message)
      throw error
    })
}

/**
 * Create and start a new render queue
 * @param {string} filePath
 * @param {DailyMedia[]} dailyMediaObjects
 * @param {string} tmpFolder
 * @param {Event} event
 * @return {Promise<never>|T}
 */
const renderClips = (filePath, dailyMediaObjects, tmpFolder, event) => {
  const renderQueue = dailyMediaObjects.slice() // Create a shallow copy as arrays are passed by reference to functions
  const renderLength = renderQueue.length
  let renderProgress = 0
  if (renderLength < 1) {
    return Promise.reject(new Error('Nothing to render'))
  }
  event.reply('render-update', null, 0)

  return renderQueue.reduce(
    (promiseChain, dailyMediaObject) => {
      return promiseChain.then(() => {
        const renderPercentage = (renderProgress / renderLength) * 90// Reserve the last 10 percent for the merging
        event.reply('render-update', dailyMediaObject, renderPercentage)
        renderProgress++
        return renderToVideoClip(dailyMediaObject, tmpFolder)
      })
    }, Promise.resolve(true))
}

/**
 * Render all videos into short clips of same size and codec that can be merged
 * into a longer compilation.
 * @param {DailyMedia} dailyMedia
 * @param {string} tmpFolder
 * @return {Promise<DailyMedia>}
 */
const renderToVideoClip = (dailyMedia, tmpFolder) => {
  const mediaMoment = moment({ year: dailyMedia.year, month: dailyMedia.month, day: dailyMedia.day })
  const mediaDateString = mediaMoment.format('YYYY-MM-DD')
  const dateName = mediaMoment.format('LL')
  const tmpFileName = path.join(tmpFolder, mediaDateString + '-no-date.mp4')
  const tmpFileNameWithDate = path.join(tmpFolder, mediaDateString + '.mp4')

  if (dailyMedia.mediaType === 'video') {
    return prepareVideoClip(dailyMedia, mediaDateString, tmpFileName)
      .then(() => {
        return addTextToVideo(dailyMedia, mediaDateString, dateName, tmpFileName, tmpFileNameWithDate)
      })
  } else if (dailyMedia.mediaType === 'image') {
    return prepareStillImageVideo(dailyMedia, tmpFolder, mediaDateString, dateName, tmpFileName)
  } else {
    return Promise.reject(new Error('Unsupported file type for ' + dailyMedia.filePath))
  }
}

/**
 * Adds the timestamp to the video
 * @param {string} dateName
 */
FfmpegCommand.prototype.addDateText = function (dateName) {
  this.videoFilters({
    filter: 'drawtext',
    options: {
      text: dateName,
      fontcolor: 'white',
      fontsize: 50,
      x: '(w)/3*2',
      y: '(h)*0.80',
      shadowcolor: 'black',
      shadowx: 2,
      shadowy: 2
    }
  })
  return this
}

/**
 * Rotate the video if necessary
 * @param {int} rotation
 */
FfmpegCommand.prototype.rotate = function (rotation) {
  switch (rotation) {
    case 90:
      console.log('Rotate right')
      this.videoFilters(
        {
          filter: 'transpose',
          options: 1
        }
      )
      break
    case 180:
      console.log('Rotate full')
      this.videoFilters(
        {
          filter: 'transpose',
          options: 2
        })
      this.videoFilters(
        {
          filter: 'transpose',
          options: 2
        })
      break
    case 270:
      console.log('Rotate left')
      this.videoFilters(
        {
          filter: 'transpose',
          options: 2
        }
      )
      break
  }
  return this
}

/**
 * Set output parameters like codec and bitrate for the clips
 * @param {string} tmpFileName
 */
FfmpegCommand.prototype.setOutputParameters = function (tmpFileName) {
  this.size('1920x1080')
    .videoBitrate('16384k')
    .videoCodec('libx264')
    .fps(30)
    .autopad('black')
    .output(tmpFileName)
  return this
}

/**
 * Render a short video clip from a video
 * @param {DailyMedia} dailyMedia
 * @param {string} mediaDateString
 * @param {string} tmpFileName
 * @return {Promise<unknown>}
 */
function prepareVideoClip (
  dailyMedia, mediaDateString, tmpFileName) {
  return new Promise((resolve, reject) => {
    const ffmpeg = new FfmpegCommand()
    currentFFmpegCommand = ffmpeg
    ffmpeg.addInput(dailyMedia.filePath)
      .seekInput(dailyMedia.timeStamp)
      .duration(1.5)
      .rotate(dailyMedia.rotation)
      .setOutputParameters(tmpFileName)
      .on('error', (e) => {
        reject(Error('Render failed for file ' + dailyMedia.filePath + ' with ffmpeg error: ' + e))
      })
      .on('start', function () {
        console.log('Rendering started for ' + dailyMedia.filePath + ' at position ' + dailyMedia.timeStamp)
      })
      .on('end', function () {
        console.log('Finished processing ' + mediaDateString)
        dailyMedia.tmpFilePath = tmpFileName
        resolve(dailyMedia)
      })
      .run()
  })
}

/**
 * Render a short video clip from a video
 * @param {DailyMedia} dailyMedia
 * @param {string} mediaDateString
 * @param {string} dateName
 * @param {string} tmpFileNameNoName
 * @param {string} tmpFileName
 * @return {Promise<unknown>}
 */
function addTextToVideo (
  dailyMedia, mediaDateString, dateName, tmpFileNameNoName, tmpFileName) {
  return new Promise((resolve, reject) => {
    const ffmpeg = new FfmpegCommand()
    currentFFmpegCommand = ffmpeg
    ffmpeg.addInput(tmpFileNameNoName)
      .addDateText(dateName)
      .setOutputParameters(tmpFileName)
      .on('error', (e) => {
        reject(Error('Render failed for file ' + dailyMedia.filePath + ' with ffmpeg error: ' + e))
      })
      .on('start', function () {
        console.log('Rendering started for ' + dailyMedia.filePath + ' at position ' + dailyMedia.timeStamp)
      })
      .on('end', function () {
        console.log('Finished processing ' + mediaDateString)
        dailyMedia.tmpFilePath = tmpFileName
        resolve(dailyMedia)
      })
      .run()
  })
}

/**
 * Render a short video clip from an image
 * @param {DailyMedia}dailyMedia
 * @param {string}tmpFolder
 * @param {string}mediaDateString
 * @param {string}dateName
 * @param {string}tmpFileName
 * @return {Promise<unknown>}
 */
function prepareStillImageVideo (dailyMedia, tmpFolder, mediaDateString, dateName, tmpFileName) {
  return new Promise((resolve, reject) => {
    const imageFile = path.join(tmpFolder, mediaDateString + '.jpg')
    const ffmpeg = new FfmpegCommand()
    currentFFmpegCommand = ffmpeg
    ffmpeg
      .addInput(imageFile)
      .loop(1.5)
      .addInput(silenceMP3Path)
      .addDateText(dateName)
      .setOutputParameters(tmpFileName)
      .on('error', (e) => {
        reject(e)
      })
      .on('start', function () {
        console.log('Rendering started')
      })
      .on('end', function () {
        console.log('Finished processing ' + mediaDateString)
        dailyMedia.tmpFilePath = tmpFileName
        resolve(dailyMedia)
      })

    sharp(dailyMedia.filePath)
      .rotate()
      .resize(1920, 1080, {
        fit: 'cover'
      })
      .toFile(imageFile)
      .then(() => ffmpeg.run())
      .catch(error => reject(error))
  })
}

/**
 * Merge previously rendered video clips into a new compilation
 * @param videoPaths
 * @param outputPath
 * @param event
 * @param {string|PromiseLike<T>|T} outputPath
 */
const mergeVideos = (videoPaths, outputPath, tmpFolder, event) => {
  const outputPathObject = path.parse(outputPath)
  outputPath = path.join(outputPathObject.dir, outputPathObject.name + '.mp4')// TODO What happens if you add mp4 extension
  return new Promise((resolve, reject) => {
    videoPaths.forEach((path) => {
      try {
        fs.statSync(path)
      } catch (e) {
        console.log('File does not exist.')
        reject(Error(e))
      }
    })
    const mergeFileContents = videoPaths.map((v) => {
      return `file '${v}'`
    }).join('\n')
    const mergeFile = path.join(tmpFolder, 'mergefile')
    fs.writeFileSync(mergeFile, mergeFileContents)
    const mergeCommand = spawn(ffmpegPath, ['-f', 'concat', '-safe', 0, '-nostdin', '-y', '-i', mergeFile, '-c', 'copy', outputPath])
    mergeCommand.on('close', code => {
      console.log(`child process exited with code ${code}`)
    })
    mergeCommand.stderr.on('data', data => {
      log.error(data)
    })
    mergeCommand.stdout.on('data', data => {
      log.debug(data)
    })
    mergeCommand.on('error', (error) => {
      log.error(`error: ${error.message}`)
      reject(error)
    })
    mergeCommand.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        log.error("Merging videos didn't work")
        reject(Error("Merging videos didn't work"))
      }
    })
  })
}

/**
 * Cancel the current running ffmpeg command
 */
const cancelRendering = () => {
  currentFFmpegCommand.kill('SIGKILL')
}

module.exports.createScreenshot = createScreenshot
module.exports.run = run
module.exports.createImagePreview = createImagePreview
module.exports.cancelRendering = cancelRendering
