
import YoutubeSearch from '../../src/media/youtubeSearch';

describe('YoutubeSearch-Integration', () => {
  const ytSearch = new YoutubeSearch();

  it('should get videos from a playlist', async () => {
    const url = 'https://youtube.com/playlist?list=PLtKAZgqi175IWVFkp4eWU-54pgirMdCs7'; // Christmas Cheer playlist
    const result = await ytSearch.getVideosFromPlaylist(url);


    // the content of videos can always change after upload, so we have to be selective in what we validate
    expect(result.length).toBe(2);
    expect(result[0].metadata.title).toEqual('Jingle Bell Guillotine');
    expect(result[0].url).toBeTruthy();
    expect(result[0].metadata.thumbnails).toHaveProperty('default');
    expect(result[1].metadata.title).toEqual('The Melancholy of Haruhi Suzumiya Opening 2 - Super Driver [Karaoke/Lyrics/Subbed]');
    expect(result[1].metadata.thumbnails).toHaveProperty('default');
    expect(result[1].url).toBeTruthy();
  });

  it('should throw an expection if provided an invalid url', async () => {
    const url = 'trash';
    await expect(ytSearch.getVideosFromPlaylist(url)).rejects.toEqual(new Error('trash is not a valid playlist url'));
  });

  it('should throw an expection if playlist does not exist', async () => {
    const url = 'https://www.youtube.com/playlist?list=awdpoajwdlihaefoihefljkjeoirjeasoirhaertoawedwaKDPWOA;DJOAESIFHOSEDIFJ';
    await expect(ytSearch.getVideosFromPlaylist(url)).rejects.toEqual(new Error('Playlist URL was invalid or contained no videos'));
  });
});

