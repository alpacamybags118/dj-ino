import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { CommandInteraction, Interaction, Message } from "discord.js";

export default class JoinVoiceCommand implements IBotCommand{
  async executeCommand(interaction: CommandInteraction): Promise<any> {
    // todo: maybe print a custom message if they are already in channel
    // todo: how can we tell the bot to disconnect after x minutes on inactivity
    const channel = interaction.options.getChannel('channel');
    console.log(channel)
    const options  = {
      channelId: channel?.id || '',
      guildId: interaction.guildId || '',
      adapterCreator: interaction.guild?.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
    }

    const connection = joinVoiceChannel(options)

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30e3)
      await interaction.reply('Joining channel!');

      return Promise.resolve('hi')
    }
    catch(err) {
      connection.destroy();
    }
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName('joinvoice')
    .setDescription('Have DJ Ino join a voice channel of your choosing. You can then have Ino play music for you.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The voice channel to join')
        .setRequired(true));

    return {
      data: command,
      execution: this.executeCommand
    };
  }
}