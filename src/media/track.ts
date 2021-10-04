import { YoutubeMetadata } from "./youtubeMetadata";

export default class Track {
  url: string;
  metadata: YoutubeMetadata;
  onStart: any;
  onEnd: any;

  constructor(url: string, onStart: any, onEnd: any, metadata: YoutubeMetadata) {
    this.url = url;
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.metadata = metadata;
  }
}