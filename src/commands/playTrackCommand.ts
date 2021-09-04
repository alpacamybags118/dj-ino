import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection, createAudioResource, AudioPlayer  } from "@discordjs/voice";
import { CommandInteraction} from "discord.js";

export default class PlayTrackCommand implements IBotCommand{
  constructor(private readonly audioPlayer: AudioPlayer){}
  
  async executeCommand(interaction: CommandInteraction, ): Promise<any> {
    const connection = getVoiceConnection(interaction.guildId || '');
    const track = interaction.options.getString('track') || ''

    if (connection == undefined) {
      interaction.reply('DJ Ino is not connected to a voice channel!');
      return Promise.reject('no good');
    }

    connection.subscribe(this.audioPlayer);

    const resource = createAudioResource(track)

    interaction.reply(`Playing ${track}`)
    this.audioPlayer.play(resource);
    return Promise.resolve('hi');
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName('playtrack')
    .setDescription('Have DJ Ino play a track in the voice channel he is in')
    .addStringOption(option =>
      option.setName('track')
        .setDescription('The URL to the track you want to play')
        .setRequired(true));

    return {
      data: command,
      execution: this.executeCommand,
    };
  }
}