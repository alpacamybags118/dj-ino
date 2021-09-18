import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, AudioResource, VoiceConnection } from "@discordjs/voice"
import { throws } from "assert"
import { inject, injectable } from "inversify"
import { TYPES } from "../const/types"
import Track from "./track"
import TrackQueue from "./trackQueue"
import YoutubeDownloader from "./youtubeDownloader"

@injectable()
export default class JukeBox {
  private readonly audioPlayer: AudioPlayer
  private readonly youtubeDownloader: YoutubeDownloader
  private readonly queue: TrackQueue

  constructor(
    @inject(TYPES.AudioPlayer) audioPlayer: AudioPlayer,
    @inject(TYPES.YoutubeDownloader) youtubeDownloader: YoutubeDownloader,
    @inject(TYPES.TrackQueue) trackQueue: TrackQueue,
  ) {
    this.audioPlayer = audioPlayer;
    this.youtubeDownloader = youtubeDownloader;
    this.queue = trackQueue;

    // configure audioplayer lifecycle
    this.audioPlayer.on("stateChange", (oldState: AudioPlayerState, newState: AudioPlayerState)=> {
      if(newState.status == AudioPlayerStatus.Idle && oldState.status != AudioPlayerStatus.Idle) {
        (oldState.resource as AudioResource<Track>).metadata.onEnd();
        this.PlayNextInQueue();
      }
    })
  }

  private async PlayNextInQueue(): Promise<void> {
    if(this.queue.Length() > 0) {
      const track = this.queue.Dequeue();

      if(track != undefined) {
        const audioStream = await this.youtubeDownloader.createAudioResource(track);
        track.onStart()
        this.audioPlayer.play(audioStream);
      }
    }
  }

  private Enqueue(track: Track) : void {
    this.queue.Enqueue(track);
  }

  public subscribeToJukebox(connection: VoiceConnection): void {
    connection.subscribe(this.audioPlayer);
  }

  public PlayTrack(track: Track): void {
    this.Enqueue(track);

    if(this.audioPlayer.state.status == AudioPlayerStatus.Idle) {
      this.PlayNextInQueue();
    }
  }

  public Pause(): void {
    this.audioPlayer.pause();
  }

  public Unpause(): void {
    this.audioPlayer.unpause();
  }

  public GetCurrentQueue(): Track[] {
    return this.queue.GetCurrentQueue();
  }

  public Skip(): void {
    this.audioPlayer.stop();
  }
}