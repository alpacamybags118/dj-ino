import fetch, { Response } from 'node-fetch'

export interface YoutubeMetadata {
  title: string,
  thumbnails: any
}

export default class YouTubeMetadata {
  public static async GetMetadataForVideo(videoID: string): Promise<YoutubeMetadata> {
    const url = `${process.env.YOUTUBE_API_BASE_URL}/videos?part=snippet&id=${videoID}&key=${process.env.YOUTUBE_API_KEY}`
    console.log(url);
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data.items[0].snippet as YoutubeMetadata;
      })
  }
}