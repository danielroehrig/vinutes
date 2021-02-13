import DailyMedia from '@/lib/DailyMedia'

const { run } = require('@/lib/VideoRenderer')
const path = require('path')

jest.mock('fs')

jest.mock('sharp')
const sharp = require('sharp')
const mockSharpResize = jest.fn()
const mockSharpToFile = jest.fn()
const mockedSharp = () => {
  return {
    resize: mockSharpResize,
    toFile: mockSharpToFile
  }
}
sharp.mockImplementation(mockedSharp)
mockSharpResize.mockImplementation(mockedSharp)
mockSharpToFile.mockImplementation(() => Promise.resolve())

const eventMock = {
  reply: () => {
    jest.fn()
  }
}

describe('Render all videos as promise chain ', () => {
  const finalVideoPath = '/wontbeused.mp4'

  it('reject an empty render list', async () => {
    const videos = []
    return expect(run('/tmp/empty.mp4', videos, '/tmp')).rejects.toThrow('Nothing to render')
  })

  it('reject an unsupported file type', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.resolve('/tmp', 'whatevs.txt'), 'text')
    ]
    return expect(run('/tmp/unsupportedType.mp4', videos, '/tmp', eventMock)).rejects.toThrow('Unsupported file type')
  })

  it('renders one video to tmp', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video')
    ]
    return expect(run(finalVideoPath, videos, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
  })

  it('renders two videos to tmp', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video'),
      new DailyMedia(2020, 1, 2, '/doesntmatter.mp4', 'video')
    ]
    return expect(run(finalVideoPath, videos, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
  })

  it('renders an image to tmp', async () => {
    const testMediaObjects = [
      new DailyMedia(2020, 1, 2, '/doesntmatter.jpg', 'image')
    ]
    return expect(run(finalVideoPath, testMediaObjects, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
  })

  it('renders two videos and two images to tmp', async () => {
    jest.setTimeout(15000)
    const testMediaObjects = [
      new DailyMedia(2020, 1, 1, '/doesntmatter.mp4', 'video'),
      new DailyMedia(2020, 1, 2, '/doesntmatter.jpg', 'image'),
      new DailyMedia(2020, 1, 3, '/doesntmatter.mp4', 'video'),
      new DailyMedia(2020, 1, 4, '/doesntmatter.jpg', 'image')
    ]
    return expect(run(finalVideoPath, testMediaObjects, '/tmp', eventMock)).resolves.toBe(finalVideoPath)
  })
})
