import DailyMedia from '@/lib/DailyMedia'

const { renderClips } = require('@/lib/VideoRenderer')
const path = require('path')

describe('Render all videos as promise chain ', () => {
  const pathToTestVideos = path.resolve(__dirname, '../../../../tests/e2e/testvideos')
  const pathToTestImages = path.resolve(__dirname, '../../../../tests/e2e/testimages')

  it('reject an empty render list', async () => {
    const videos = []
    return expect(renderClips('/tmp/empty.mp4', videos, '/tmp')).rejects.toThrow('Nothing to render')
  })

  it('reject an unsupported file type', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.resolve('/tmp', 'whatevs.txt'), 'text')
    ]
    return expect(renderClips('/tmp/unsupportedType.mp4', videos, '/tmp')).rejects.toThrow('Unsupported file type')
  })

  it('renders one video to tmp', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.resolve(pathToTestVideos, 'familie.mp4'), 'video')
    ]
    return expect(renderClips('/tmp/oneVideo.mp4', videos, '/tmp')).resolves.toBe(videos[0])
  })

  it('renders two videos to tmp', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.resolve(pathToTestVideos, 'familie.mp4'), 'video'),
      new DailyMedia(2020, 1, 2, path.resolve(pathToTestVideos, 'vacation.mp4'), 'video')
    ]
    return expect(renderClips('/tmp/twoVideos.mp4', videos, '/tmp')).resolves.toBe(videos[1])
  })

  it('changing render order doesn\'t change outcome', async () => {
    const videos = [
      new DailyMedia(2020, 1, 2, path.resolve(pathToTestVideos, 'vacation.mp4'), 'video'),
      new DailyMedia(2020, 1, 1, path.resolve(pathToTestVideos, 'familie.mp4'), 'video')
    ]
    return expect(renderClips('/tmp/renderOrder.mp4', videos, '/tmp')).resolves.toBe(videos[1])
  })

  it('renders an image to tmp', async () => {
    const testMediaObjects = [
      new DailyMedia(2020, 1, 2, path.resolve(pathToTestImages, 'beach.jpg'), 'image')
    ]
    return expect(renderClips('/tmp/fromImage.mp4', testMediaObjects, '/tmp')).resolves.toBe(testMediaObjects[0])
  })

  it('renders two videos and two images to tmp', async () => {
    jest.setTimeout(10000)
    const testMediaObjects = [
      new DailyMedia(2020, 1, 1, path.resolve(pathToTestVideos, 'familie.mp4'), 'video'),
      new DailyMedia(2020, 1, 2, path.resolve(pathToTestImages, 'beach.jpg'), 'image'),
      new DailyMedia(2020, 1, 3, path.resolve(pathToTestVideos, 'vacation.mp4'), 'video'),
      new DailyMedia(2020, 1, 4, path.resolve(pathToTestImages, 'cliff.jpg'), 'image')
    ]
    return expect(renderClips('/tmp/twovidstwoimages.mp4', testMediaObjects, '/tmp')).resolves.toBe(testMediaObjects[3])
  })
})
