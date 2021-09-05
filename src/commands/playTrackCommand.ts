import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection, createAudioResource, AudioPlayer, demuxProbe  } from "@discordjs/voice";
import { CommandInteraction} from "discord.js";
import YoutubeDownloader from "../media/youtubeDownloader";

export default class PlayTrackCommand implements IBotCommand{
  name = 'playtrack';

  constructor(private readonly audioPlayer: AudioPlayer){}
  
  async executeCommand(interaction: CommandInteraction, ): Promise<any> {
    const connection = getVoiceConnection(interaction.guildId || '');
    const track = interaction.options.getString('track') || ''
    const ytdl = new YoutubeDownloader();

    if (connection == undefined) {
      interaction.reply('DJ Ino is not connected to a voice channel!');
      return Promise.reject('no good');
    }

    connection.subscribe(this.audioPlayer);

    const audioStream = await ytdl.createAudioResource(track);

    console.log('Got process');

    interaction.reply(`Playing ${track}`)
    this.audioPlayer.play(audioStream);
    return Promise.resolve('hi');
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName(this.name)
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