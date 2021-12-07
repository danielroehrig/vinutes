import DailyMedia, { dateAsIso } from '@/lib/DailyMedia'

describe('Date as ISO ', () => {
  it('displays the daily media time stamp as ISO', () => {
    const dailyMedia = new DailyMedia(2004, 1, 27, '', '', 0, 0.0)
    expect(dateAsIso(dailyMedia)).toEqual('2004-01-27')
    expect(dailyMedia.dateAsIso).toEqual('2004-01-27')
  })
})
