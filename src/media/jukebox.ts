import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice"
import { inject, injectable } from "inversify"
import { TYPES } from "../const/types"
import YoutubeDownloader from "./youtubeDownloader"

@injectable()
export default class JukeBox {
  private readonly audioPlayer: AudioPlayer
  private readonly youtubeDownloader: YoutubeDownloader
  private queue: Array<string>

  constructor(
    @inject(TYPES.AudioPlayer) audioPlayer: AudioPlayer,
    @inject(TYPES.YoutubeDownloader) youtubeDownloader: YoutubeDownloader,
  ) {
    this.audioPlayer = audioPlayer;
    this.youtubeDownloader = youtubeDownloader;
    this.queue = [];

    // configure audioplayer lifecycle
    this.audioPlayer.on("stateChange", (oldState: AudioPlayerState, newState: AudioPlayerState)=> {
      if(newState.status == AudioPlayerStatus.Idle && oldState.status != AudioPlayerStatus.Idle) {
        this.PlayNextInQueue();
      }
    })
  }

  private async PlayNextInQueue(): Promise<void> {
    if(this.queue.length > 0) {
      const track = this.queue.pop();

      if(track != undefined) {
        const audioStream = await this.youtubeDownloader.createAudioResource(track);
        this.audioPlayer.play(audioStream);
      }
    }
  }

  private Enqueue(track: string) : void {
    this.queue.push(track);
  }

  public subscribeToJukebox(connection: VoiceConnection): void {
    connection.subscribe(this.audioPlayer);
  }

  public PlayTrack(track: string): void {
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
}