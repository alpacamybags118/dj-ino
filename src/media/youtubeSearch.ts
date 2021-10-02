import { injectable } from "inversify";
import fetch, { Response } from 'node-fetch'

interface YoutubePlaylistItem {
  kind: string,
  etag: string,
  id: string,
  contentDetails: {
    videoId: string,
    videoPublishedAt: string,
  }
}

@injectable()
export default class YoutubeSearch {
  constructor(){}

  public static isPlaylistUrl(url: string): boolean {
    return url.includes('playlist');
  }

  public async getVideosFromPlaylist(playlistUrl: string): Promise<string[]> {
    const playListId = this.parsePlaylistId(playlistUrl);

    const playlistVideos = await this.GetYoutubePlaylistData(playListId)
    console.log(playlistVideos.length)

    return playlistVideos.map((item) => item.contentDetails.videoId);
  }

  private parsePlaylistId(playlistUrl: string): string {
    return playlistUrl.split('=')[1];
  }

  private async GetYoutubePlaylistData(playlistID: string): Promise<YoutubePlaylistItem[]> {
    const playlistUrl = `${process.env.YOUTUBE_API_BASE_URL}/playlistItems?part=contentDetails&playlistId=${playlistID}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;
    console.log(playlistUrl);
    return fetch(playlistUrl)
      .then((response: Response) => response.json() as any)
      .then((data) => data.items as YoutubePlaylistItem[]);
  }
}