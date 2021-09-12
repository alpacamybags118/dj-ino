import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import {  AudioPlayer  } from "@discordjs/voice";
import { CommandInteraction} from "discord.js";
import { inject, injectable } from "inversify";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";

@injectable()
export default class PauseTrackCommand implements IBotCommand{
  private jukebox: JukeBox;

  name = 'pause';

  constructor(@inject(TYPES.Jukebox) jukebox: JukeBox){
    this.jukebox = jukebox;
  }
  
  async executeCommand(interaction: CommandInteraction): Promise<void> {
    interaction.reply('Pausing Track.');
    
    this.jukebox.Pause();
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('DJ Ino will pause the current track, if one is playing')

    return {
      data: command,
      execution: this.executeCommand,
    };
  }
}