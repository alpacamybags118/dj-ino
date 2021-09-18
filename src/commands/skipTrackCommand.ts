import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction} from "discord.js";
import { inject, injectable } from "inversify";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";

@injectable()
export default class SkipTrackCommand implements IBotCommand{
  private jukebox: JukeBox;

  name = 'skip';

  constructor(@inject(TYPES.Jukebox) jukebox: JukeBox){
    this.jukebox = jukebox;
  }
  
  async executeCommand(interaction: CommandInteraction): Promise<void> {
    interaction.reply('Skipping Track.');
    
    this.jukebox.Skip();
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('DJ Ino will skip the current track and play the next track in the queue')

    return {
      data: command,
      execution: this.executeCommand,
    };
  }
}