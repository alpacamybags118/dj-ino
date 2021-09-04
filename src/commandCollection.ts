import { IBotCommand } from "./commands/iBotCommand";
import MimicCommand from "./commands/mimicCommand";
import JoinVoiceCommand from "./commands/joinVoiceCommand";
import PlayTrackCommand from "./commands/playTrackCommand";
import { AudioPlayer } from "@discordjs/voice";
import { inject } from "inversify";
import { TYPES } from "./const/types";
import PauseTrackCommand from "./commands/pauseTrackCommand";
import ResumeTrackCommand from "./commands/resumeTrackCommand";

export default class CommandCollection {
  audioPlayer: AudioPlayer
  commands: IBotCommand[]

  constructor(@inject(TYPES.AudioPlayer) audioPlayer: AudioPlayer) {
    this.audioPlayer = audioPlayer
    this.commands = this.loadCommands();
  }

  // todo, make this dynamically get each bot config
  loadCommands(): IBotCommand[] {
    return [new MimicCommand(), new JoinVoiceCommand(), new PlayTrackCommand(this.audioPlayer), new PauseTrackCommand(this.audioPlayer), new ResumeTrackCommand(this.audioPlayer)];
  }
}