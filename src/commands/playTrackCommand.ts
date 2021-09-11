import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection, createAudioResource, AudioPlayer, demuxProbe, AudioPlayerStatus  } from "@discordjs/voice";
import { CommandInteraction} from "discord.js";
import YoutubeDownloader from "../media/youtubeDownloader";
import { inject, injectable } from "inversify";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";

@injectable()
export default class PlayTrackCommand implements IBotCommand{
  private jukebox: JukeBox

  name = 'playtrack';

  constructor(@inject(TYPES.Jukebox) jukeBox: JukeBox){
    this.jukebox = jukeBox;
  }
  
  async executeCommand(interaction: CommandInteraction, ): Promise<any> {
    const connection = getVoiceConnection(interaction.guildId || '');
    const track = interaction.options.getString('track') || ''

    if (connection == undefined) {
      interaction.reply('DJ Ino is not connected to a voice channel!');
      return Promise.reject('no good');
    }

    this.jukebox.subscribeToJukebox(connection);
    this.jukebox.PlayTrack(track)
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