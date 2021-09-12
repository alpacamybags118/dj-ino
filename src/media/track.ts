export default class Track {
  url: string;
  onStart: any;
  onEnd: any;

  constructor(url: string, onStart: any, onEnd: any) {
    this.url = url;
    this.onEnd = onEnd;
    this.onStart = onStart;
  }
}