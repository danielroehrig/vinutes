import DailyMedia from '@/lib/DailyMedia'
import * as path from 'path'

const { getMissingFiles } = require('@/lib/FileChecker')

describe('get missing files ', () => {
  it('finds no missing files in an empty array', async () => {
    const videos = []
    return expect(getMissingFiles(videos)).resolves.toStrictEqual([])
  })

  it('finds no missing files with an existing file in the array', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.join(__dirname, '..', '..', '_support', 'emptyJpg.jpg'), 'text')
    ]
    return expect(getMissingFiles(videos)).resolves.toStrictEqual([])
  })

  it('finds no missing files with two existing file in the array', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.join(__dirname, '..', '..', '_support', 'emptyJpg.jpg'), 'text'),
      new DailyMedia(2020, 1, 2, path.join(__dirname, '..', '..', '_support', 'emptyPng.png'), 'text')
    ]
    return expect(getMissingFiles(videos)).resolves.toStrictEqual([])
  })

  it('finds one missing file with a missing file in the array', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.join(__dirname, '..', '..', '_support', 'nofile.nope'), 'text')
    ]
    return expect(getMissingFiles(videos)).resolves.toStrictEqual([videos[0]])
  })

  it('finds one missing file with a missing file in the array', async () => {
    const videos = [
      new DailyMedia(2020, 1, 1, path.join(__dirname, '..', '..', '_support', 'emptyJpg.jpg'), 'text'),
      new DailyMedia(2020, 1, 2, path.join(__dirname, '..', '..', '_support', 'nofile.nope'), 'text')
    ]
    return expect(getMissingFiles(videos)).resolves.toStrictEqual([videos[1]])
  })
})
