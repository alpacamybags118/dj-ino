import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed} from "discord.js";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";
import { inject, injectable } from "inversify";
import MessageFormatter from "../utility/messageFormatter";
import { arrayBuffer } from "stream/consumers";

@injectable()
export default class ListQueueCommand implements IBotCommand {
  private jukebox: JukeBox
  name = 'listqueue';

  constructor(@inject(TYPES.Jukebox) jukebox: JukeBox){
    this.jukebox = jukebox;
  }
  
  async executeCommand(interaction: CommandInteraction): Promise<void> {
    const queue = this.jukebox.GetCurrentQueue();

    if(queue.length == 0) {
      interaction.reply('Queue is empty!');
    } else {
      const messages = queue.map(track => {
        return MessageFormatter.MakeFormattedDiscordMessage(track.url, track.metadata);
      });
      interaction.reply('The current queue is listed below');
      // discord api only lets 10 embedded messages be sent at a time, so need to chunk
      if (messages.length > 10) {
        for(let i = 0; i < messages.length; i+= 10) {
          const chunk = messages.slice(i, i+10);
          interaction.followUp({embeds: chunk});
        }
      } else {
        interaction.followUp({embeds: messages});
      }
    }
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