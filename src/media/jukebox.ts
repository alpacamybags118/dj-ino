import { AudioPlayer, AudioPlayerState, AudioPlayerStatus, AudioResource, VoiceConnection } from "@discordjs/voice"
import { inject, injectable } from "inversify"
import { TYPES } from "../const/types"
import Logger from "../utility/logger"
import Track from "./track"
import TrackQueue from "./trackQueue"
import YoutubeDownloader from "./youtubeDownloader"

@injectable()
export default class JukeBox {
  private readonly audioPlayer: AudioPlayer;
  private readonly youtubeDownloader: YoutubeDownloader;
  private readonly queue: TrackQueue;
  private readonly logger: Logger;

  constructor(
    @inject(TYPES.AudioPlayer) audioPlayer: AudioPlayer,
    @inject(TYPES.YoutubeDownloader) youtubeDownloader: YoutubeDownloader,
    @inject(TYPES.TrackQueue) trackQueue: TrackQueue,
    @inject(TYPES.Logger) logger: Logger,

  ) {
    this.audioPlayer = audioPlayer;
    this.youtubeDownloader = youtubeDownloader;
    this.queue = trackQueue;
    this.logger = logger;

    // configure audioplayer lifecycle
    this.audioPlayer.on("stateChange", (oldState: AudioPlayerState, newState: AudioPlayerState)=> {
      if(newState.status == AudioPlayerStatus.Idle && oldState.status != AudioPlayerStatus.Idle) {
        (oldState.resource as AudioResource<Track>).metadata.OnEnd();
        this.PlayNextInQueue();
      }
    })
  }

  private async PlayNextInQueue(): Promise<void> {
    if(this.queue.Length() > 0) {
      const track = this.queue.Dequeue();

      if(track != undefined) {
        const audioStream = await this.youtubeDownloader.createAudioResource(track);
        track.OnStart()
        this.audioPlayer.play(audioStream);
      }
    }
  }

  private Enqueue(track: Track) : void {
    this.queue.Enqueue(track);
  }

  public subscribeToJukebox(connection: VoiceConnection): void {
    this.logger.Info('starting jukebox');
    connection.subscribe(this.audioPlayer);
  }

  public AddPlaylist(tracks: Track[]) {
    tracks.forEach((track) => this.Enqueue(track));

    this.StartJukeBoxIfIdle();
  }

  public PlayTrack(track: Track): void {
    this.Enqueue(track);

    this.StartJukeBoxIfIdle();
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

  public ClearQueue(): void {
    this.queue.Clear();
  }

  private StartJukeBoxIfIdle(): void {
    if(this.audioPlayer.state.status == AudioPlayerStatus.Idle) {
      this.PlayNextInQueue();
    }
  }
}