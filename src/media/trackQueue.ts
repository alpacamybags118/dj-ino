import { injectable } from "inversify";
import Track from "./track";

@injectable()
export default class TrackQueue {
  private queue: Track[]

  constructor(){
    this.queue = [];
  }

  Length(): number {
    return this.queue.length;
  }

  Enqueue(track: Track): void {
    this.queue.push(track);
  }

  Dequeue(): Track | undefined {
    return this.queue.shift();
  }

  GetCurrentQueue(): Track[] {
    return this.queue;
  }
}