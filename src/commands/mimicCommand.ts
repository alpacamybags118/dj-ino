import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { injectable } from "inversify";

// todo: maybe make these configs load from the command json instead of having to put them in 2 places?
@injectable()
export default class MimicCommand implements IBotCommand{
  name = 'mimic';

  async executeCommand(interaction: any): Promise<void> {
      await interaction.reply('test');
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription('Replies with your input!')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('The input to echo back')
        .setRequired(true));

    return {
      data: command,
      execution: this.executeCommand
    };
  }
}