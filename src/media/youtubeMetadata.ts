import fetch, { Response } from 'node-fetch'

export interface YoutubeMetadata {
  title: string,
  description: string,
  thumbnails: any
}

export default class YouTubeMetadata {
  public static async GetMetadataForVideo(videoID: string): Promise<YoutubeMetadata> {
    const url = `${process.env.YOUTUBE_API_BASE_URL}/videos?part=snippet&id=${videoID}&key=${process.env.YOUTUBE_API_KEY}`
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.items[0].snippet);
        return data.items[0].snippet as YoutubeMetadata;
      })
  }
}