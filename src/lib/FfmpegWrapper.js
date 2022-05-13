const { spawn } = require('child_process')

let currentChildProcess = null
/**
 * Spawn a ffmpeg process that merges the video files stated in the mergefile,
 * a text file in an ffmpeg readable format.
 * @param {string} ffmpegPath Path to the ffmpeg binary
 * @param {string} mergeFile Text file where each line is a video snippet to merge
 * @param {string} outputPath Path where the final video should be saved
 * @returns {Promise<string>} The actual output path or an Error
 */
const mergeVideos = (ffmpegPath, mergeFile, outputPath) => {
  return new Promise((resolve, reject) => {
    currentChildProcess = spawn(ffmpegPath, ['-f', 'concat', '-safe', 0, '-nostdin', '-y', '-i', mergeFile, '-c', 'copy', outputPath])
    currentChildProcess.on('close', (code) => {
      currentChildProcess = null
      if (code === 0) {
        resolve(outputPath)
      } else {
        reject(Error("Merging videos didn't work"))
      }
    })
  })
}

/**
 * Kill the current FFMPEG process
 */
const killCurrentProcess = () => {
  currentChildProcess.kill()
}

module.exports.spawnMergeVideos = mergeVideos
module.exports.killCurrentFfmpegProcess = killCurrentProcess
