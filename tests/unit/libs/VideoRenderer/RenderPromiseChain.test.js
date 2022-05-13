import DailyMedia from '@/lib/DailyMedia'

const { run } = require('@/lib/VideoRenderer')
const FfmpegCommand = require('fluent-ffmpeg')

jest.mock('fs')
jest.mock('sharp')
const sharp = require('sharp')
const mockSharpResize = jest.fn()
const mockSharpToFile = jest.fn()
const mockSharpRotate = jest.fn()
const mockedSharp = () => {
  return {
    resize: mockSharpResize,
    toFile: mockSharpToFile,
    rotate: mockSharpRotate
  }
}
sharp.mockImplementation(mockedSharp)
mockSharpResize.mockImplementation(mockedSharp)
mockSharpToFile.mockImplementation(mockedSharp)
mockSharpRotate.mockImplementation(mockedSharp)

const eventMock = {
  reply: () => {
    jest.fn()
  }
}

const { spawnMergeVideos } = require('@/lib/FfmpegWrapper')
jest.mock('@/lib/FfmpegWrapper')

describe('Render all videos as promise chain ', () => {
  const finalVideoPath = '/wontbeused.mp4'
  beforeEach(() => {
    mockSharpToFile.mockImplementation(() => Promise.resolve())
    spawnMergeVideos.mockImplementation((ffmpegPath, mergeFile, outputPath) => {
      return Promise.resolve(outputPath)
    })
    FfmpegCommand.prototype.run.mockImplementation(function () {
      this.emit('end')
    })
  })

  it('reject an empty render list', async () => {
    const videos = []
    return expect(run('/tmp/empty.mp4', videos, '/tmp')).rejects.toThrow('Nothing to render')
  })

  it('reject an unsupported file type', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, '/tmp/whatevs.txt', 'text', 0)
    ]
    return expect(run('/tmp/unsupportedType.mp4', videos, '/tmp', eventMock)).rejects.toThrow('Unsupported file type')
  })

  it('renders one video to tmp', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video', 0)
    ]
    return expect(run(finalVideoPath, videos, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
  })

  it('renders two videos to tmp', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video', 0),
      new DailyMedia(2020, 1, 2, '/doesntmatter.mp4', 'video', 0)
    ]
    return expect(run(finalVideoPath, videos, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
  })

  it('rendering a video crashes', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video', 0),
      new DailyMedia(2020, 1, 2, '/doesntmatter.mp4', 'video', 0)
    ]
    FfmpegCommand.prototype.run.mockImplementation(function () {
      this.emit('error', 'A Video Crashed')
    })
    return expect(run(finalVideoPath, videos, '/tmp', eventMock)).rejects.toThrow('A Video Crashed')
  })

  it('merging two videos crashes', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video', 0),
      new DailyMedia(2020, 1, 2, '/doesntmatter.mp4', 'video', 0)
    ]
    spawnMergeVideos.mockImplementation((ffmpegPath, mergeFile, outputPath) => {
      return Promise.reject(Error('A Merge Crashed'))
    })
    return expect(run(finalVideoPath, videos, '/tmp', eventMock)).rejects.toThrow('A Merge Crashed')
  })

  it('renders an image to tmp', async () => {
    const testMediaObjects = [
      new DailyMedia(2020, 1, 2, '/doesntmatter.jpg', 'image', 0)
    ]
    await expect(run(finalVideoPath, testMediaObjects, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
    expect(mockSharpResize).toHaveBeenCalledTimes(1)
  })

  it('renders an image to tmp crashes chain', async () => {
    const testMediaObjects = [
      new DailyMedia(2020, 1, 2, '/doesntmatter.jpg', 'image', 0)
    ]
    mockSharpToFile.mockImplementation(() => Promise.reject(Error('Some Sharp Error')))
    await expect(run(finalVideoPath, testMediaObjects, '/tmp', eventMock)).rejects.toThrow('Some Sharp Error')
    expect(mockSharpResize).toHaveBeenCalledTimes(1)
  })

  it('renders two videos and two images to tmp', async () => {
    jest.setTimeout(15000)
    const testMediaObjects = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video', 0),
      new DailyMedia(2020, 1, 2, '/doesntmatter.jpg', 'image', 0),
      new DailyMedia(2020, 1, 3, '/doesntmatter.mp4', 'video', 0),
      new DailyMedia(2020, 1, 4, '/doesntmatter.jpg', 'image', 0)
    ]
    return expect(run(finalVideoPath, testMediaObjects, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
  })
})
