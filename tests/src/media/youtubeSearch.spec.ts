
import YoutubeSearch from '../../../src/media/youtubeSearch';

describe('YoutubeSearch', () => {
  it('should return true when URL is a valid playlist url', () => {
    const url = 'something.com/playlist';

    expect(YoutubeSearch.isPlaylistUrl(url)).toBeTruthy()
  });

  it('should return false when URL is not a valid playlist url', () => {
    const url = 'something.com';

    expect(YoutubeSearch.isPlaylistUrl(url)).toBeFalsy()
  });
});

