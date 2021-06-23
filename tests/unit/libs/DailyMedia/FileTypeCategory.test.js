import * as path from 'path'
import { getMediaTypeFromFile } from '@/lib/MediumRecognizer'

describe('Determine if file is video or image ', () => {
  it('correctly identifies images', () => {
    expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'emptyJpg.jpg'))).resolves.toBe('image')
    expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'emptyPng.png'))).resolves.toBe('image')
  })
})
