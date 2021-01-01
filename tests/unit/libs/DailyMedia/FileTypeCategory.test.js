import { fileTypeCategory } from '@/lib/DailyMedia'
import * as path from 'path'

describe('Determine if file is video or image ', () => {
  it('correctly identifies images', () => {
    expect(fileTypeCategory(path.join(__dirname, '..', '..', '_support', 'emptyJpg.jpg'))).toEqual('image')
    expect(fileTypeCategory(path.join(__dirname, '..', '..', '_support', 'emptyPng.png'))).toEqual('image')
  })
})
