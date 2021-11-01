import { injectable } from "inversify";
import fetch, { Response } from 'node-fetch'
import YouTubeMetadataFetcher, { YoutubeMetadata } from "./youtubeMetadata";
import YoutubeVideo from "./youtubeVideo";

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

  public async getVideosFromPlaylist(playlistUrl: string): Promise<YoutubeVideo[]> {
    if(!YoutubeSearch.isPlaylistUrl(playlistUrl)) {
      throw new Error(`${playlistUrl} is not a valid playlist url`);
    }

    const playListId = this.parsePlaylistId(playlistUrl);

    const playlistVideos = await this.GetYoutubePlaylistData(playListId);

    if(!playlistVideos || playlistVideos.length === 0) {
      throw new Error('Playlist URL was invalid or contained no videos');
    };
    
    const videoMetadata = await Promise.all(playlistVideos.map((video) => YouTubeMetadataFetcher.GetMetadataForVideo(video.contentDetails.videoId)));
    // handle metadata not returning
    return playlistVideos.map((video, index) => {
      return {
        url: `https://www.youtube.com/watch?v=${video.contentDetails.videoId}`,
        metadata: videoMetadata[index],
      } as unknown as YoutubeVideo
    }) as YoutubeVideo[]
  }

  public async getVideoFromUrl(videoUrl: string): Promise<YoutubeVideo> {
    const videoId = this.ParseVideoIdFromUrl(videoUrl)

    return await YouTubeMetadataFetcher.GetMetadataForVideo(videoId)
      .then((metadata: YoutubeMetadata) => {
        return {
        url: videoUrl,
        metadata: metadata,
      } as YoutubeVideo
    })
  }

  private parsePlaylistId(playlistUrl: string): string {
    return playlistUrl.split('=')[1];
  }

  private async GetYoutubePlaylistData(playlistID: string): Promise<YoutubePlaylistItem[]> {
    const playlistUrl = `${process.env.YOUTUBE_API_BASE_URL}/playlistItems?part=contentDetails&playlistId=${playlistID}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;
    return fetch(playlistUrl)
      .then((response: Response) => response.json() as any)
      .then((data) => data.items as YoutubePlaylistItem[])
  }

  // Accounting for two types of youtube urls that could come in
  private ParseVideoIdFromUrl(videoUrl: string): string {
    const urlPart = videoUrl.split('=')
    if(urlPart.length == 1) {
      return videoUrl.split('.be/')[1]
    } else {
      return urlPart[1]
    }
  }
}