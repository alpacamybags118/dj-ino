import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, VoiceConnectionState, VoiceConnectionStatus } from "@discordjs/voice";
import { Client, CommandInteraction} from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../const/types";

@injectable()
export default class JoinVoiceCommand implements IBotCommand{
  private client: Client
  name = 'joinvoice';

  constructor(
    @inject(TYPES.Client) client: Client
  ){
    this.client = client;
  }
  
  async executeCommand(interaction: CommandInteraction): Promise<void> {
    // todo: maybe print a custom message if they are already in channel
    // todo: how can we tell the bot to disconnect after x minutes on inactivity
    // BUG - if joins voicechat via this command and is manually disconnected, it still considered itself joined in a connection
    const channel = interaction.options.getChannel('channel');
    console.log(channel)
    const options  = {
      channelId: channel?.id || '',
      guildId: interaction.guildId || '',
      adapterCreator: interaction.guild?.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator
    }

    const connection = joinVoiceChannel(options)

    connection.on('stateChange', (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
      if(newState.status == VoiceConnectionStatus.Disconnected) {
        console.log('destroying connection');
        this.client.user.setPresence({activities: undefined});
        connection.destroy();
      }
    })

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30e3)
      await interaction.reply('Joining channel!');
    }
    catch(err) {
      connection.destroy();
    }
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName(this.name)
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