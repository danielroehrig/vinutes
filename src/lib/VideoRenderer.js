const { app } = require('electron')
const moment = require('moment')
const path = require('path')
const fs = require('fs')
const os = require('os')
let ffmpegPath = null
const silenceMP3Path = path.resolve(path.join(app.getAppPath(), '..', 'public', 'silence.mp3'))
const FfmpegCommand = require('fluent-ffmpeg')
const sharp = require('sharp')
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
  currentFFmpegCommand = new FfmpegCommand(dailyMedia.filePath).screenshots({
    timestamps: [dailyMedia.timeStamp],
    filename: screenshotName,
    folder: app.getPath('temp'),
    size: '320x180'
  }).on('end', function () {
    console.log('screenshot created')
    const buff = fs.readFileSync(path.join(app.getPath('temp'), screenshotName))
    dailyMedia.previewImage = buff.toString('base64')
    event.reply('screenshot-created', dailyMedia)
  })
}

/**
 * Create and save a thumbnail of a given image
 * @param dailyMedia
 * @param event
 * @return {Promise<void>}
 */
const createImagePreview = (dailyMedia, event) => {
  sharp(dailyMedia.filePath)
    .resize(320, 180, {
      fit: 'cover'
    })
    .jpeg()
    .toBuffer()
    .then((outputBuffer) => {
      dailyMedia.previewImage = outputBuffer.toString('base64')
      event.reply('screenshot-created', dailyMedia)
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
        return mergeVideos(filePaths, filePath, event)
      }
    )
}

/**
 * Create and start a new render queue
 * @param filePath
 * @param dailyMediaObjects
 * @param tmpFolder
 * @param event
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
 * @param dailyMedia
 * @param tmpFolder
 * @return {Promise<DailyMedia>}
 */
const renderToVideoClip = (dailyMedia, tmpFolder) => {
  const mediaMoment = moment({ year: dailyMedia.year, month: dailyMedia.month, day: dailyMedia.day })
  const mediaDateString = mediaMoment.format('YYYY-MM-DD')
  const dateName = mediaMoment.format('LL')
  const tmpFileName = path.join(tmpFolder, mediaDateString + '.mp4')

  if (dailyMedia.mediaType === 'video') {
    return prepareVideoClip(dailyMedia, tmpFolder, mediaDateString, dateName, tmpFileName)
  } else if (dailyMedia.mediaType === 'image') {
    return prepareStillImageVideo(dailyMedia, tmpFolder, mediaDateString, dateName, tmpFileName)
  } else {
    return Promise.reject(new Error('Unsupported file type'))
  }
}

/**
 * Adds the timestamp to the video
 * @param {string}dateName
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
 * Set output parameters like codec and bitrate for the clips
 * @param tmpFileName
 */
FfmpegCommand.prototype.setOutputParameters = function (tmpFileName) {
  this.size('1920x1080')
    .videoBitrate('16384k')
    .videoCodec('libx264')
    .autopad('black')
    .output(tmpFileName)
  return this
}

/**
 * Render a short video clip from a video
 * @param {DailyMedia}dailyMedia
 * @param {string}tmpFolder
 * @param {string}mediaDateString
 * @param {string}dateName
 * @param {string}tmpFileName
 * @return {Promise<unknown>}
 */
function prepareVideoClip (dailyMedia, tmpFolder, mediaDateString, dateName, tmpFileName) {
  return new Promise((resolve, reject) => {
    const ffmpeg = new FfmpegCommand()
    currentFFmpegCommand = ffmpeg
    ffmpeg.addInput(dailyMedia.filePath)
      .seekInput(dailyMedia.timeStamp)
      .duration(1.5)
      .addDateText(dateName)
      .setOutputParameters(tmpFileName)
      .on('error', (e) => {
        reject(Error(e))
      })
      .on('start', function () {
        console.log('Rendering started')
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
const mergeVideos = (videoPaths, outputPath, event) => {
  const outputPathObject = path.parse(outputPath)
  outputPath = path.join(outputPathObject.dir, outputPathObject.name + '.mp4')// TODO What happens if you add mp4 extension
  const mergeCommand = new FfmpegCommand()
  currentFFmpegCommand = mergeCommand
  return new Promise((resolve, reject) => {
    videoPaths.forEach((path) => {
      try {
        fs.statSync(path)
      } catch (e) {
        console.log('File does not exist.')
        reject(Error(e))
      }
      mergeCommand.addInput(path)
    })
    mergeCommand
      .on('end', () => {
        console.log('merging ended')
        resolve(outputPath)
      })
      .on('error', (e) => {
        reject(Error(e))
      })
      .on('start', () => {
        event.reply('render-update', null, 90)
        console.log('merging started')
      })
      .mergeToFile(outputPath, app.getPath('temp'))
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
