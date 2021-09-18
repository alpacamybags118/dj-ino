import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction} from "discord.js";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";
import { inject, injectable } from "inversify";

@injectable()
export default class ListQueueCommand implements IBotCommand {
  private jukebox: JukeBox
  name = 'listqueue';

  constructor(@inject(TYPES.Jukebox) jukebox: JukeBox){
    this.jukebox = jukebox;
  }
  
  async executeCommand(interaction: CommandInteraction): Promise<void> {
    const queue = this.jukebox.GetCurrentQueue()
    let response = '';

    if(queue.length == 0) {
      response = 'Queue is empty!';
    } else {
      response = 'Current Queue: \n';
      queue.forEach(track => {
        response += `${track.url} \n`
      });
    }

    interaction.reply(response);
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('DJ Ino will list all tracks currently in the queue.')

    return {
      data: command,
      execution: this.executeCommand,
    };
  }
}