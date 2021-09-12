import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction} from "discord.js";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";
import { inject, injectable } from "inversify";

@injectable()
export default class ResumeTrackCommand implements IBotCommand{
  private jukebox: JukeBox
  name = 'resume';

  constructor(@inject(TYPES.Jukebox) jukebox: JukeBox){
    this.jukebox = jukebox;
  }
  
  async executeCommand(interaction: CommandInteraction): Promise<void> {
    interaction.reply('Resuming Track.');
    this.jukebox.Unpause();
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('DJ Ino will resume playing')

    return {
      data: command,
      execution: this.executeCommand,
    };
  }
}