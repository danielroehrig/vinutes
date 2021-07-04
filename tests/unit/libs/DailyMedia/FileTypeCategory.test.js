import * as path from 'path'
import { getMediaTypeFromFile } from '@/lib/MediumRecognizer'

describe('Determine if file is video or image ', () => {
  it('correctly identifies images', async () => {
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'emptyJpg.jpg'))).resolves.toBe('image')
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'emptyPng.png'))).resolves.toBe('image')
  })
  it('dismisses random non video or image files', async () => {
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'emptyPdf.pdf'))).rejects.toThrowError('Could not determine type from extension')
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'emptyOdt.odt'))).rejects.toThrowError('Could not determine type from extension')
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'emptySvg.svg'))).rejects.toThrowError('Could not determine type from extension')
  })
  it('correctly identifies videos', async () => {
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'empeefourtest.mp4'))).resolves.toBe('video')
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'empeggfour.avi'))).resolves.toBe('video')
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'empeggtwo.mpg'))).resolves.toBe('video')
    await expect(getMediaTypeFromFile(path.join(__dirname, '..', '..', '_support', 'webem.webm'))).resolves.toBe('video')
  })
})
