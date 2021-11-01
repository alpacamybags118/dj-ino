import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection} from "@discordjs/voice";
import { Client, CommandInteraction} from "discord.js";
import { inject, injectable } from "inversify";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";
import Track from "../media/track";
import YoutubeSearch from "../media/youtubeSearch";
import { stringify } from "querystring";

@injectable()
export default class PlayTrackCommand implements IBotCommand {
  private client: Client
  private jukebox: JukeBox
  private youtubeSearch: YoutubeSearch

  name = 'playtrack';

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Jukebox) jukeBox: JukeBox,
    @inject(TYPES.YoutubeSearch) youtubeSearch: YoutubeSearch
    ){
    this.client = client;
    this.jukebox = jukeBox;
    this.youtubeSearch = youtubeSearch;
  }
  
  async executeCommand(interaction: CommandInteraction, ): Promise<void> {
    let url: string;

    const connection = getVoiceConnection(interaction.guildId);

    try {
      url = interaction.options.getString('track', true);
    } catch(e) {
      interaction.reply('URL was not provided or could not be processed. Please try again.');
      console.log(e)
      return;
    }

    if (connection == undefined) {
      interaction.reply('DJ Ino is not connected to a voice channel!');
      return;
    }

    if(!url.includes('https://')) {
      interaction.reply('Provided track is not a valid url!');
      return;
    }

    this.jukebox.subscribeToJukebox(connection);

    if(YoutubeSearch.isPlaylistUrl(url)) {
      interaction.reply('Playlist detected. Adding all tracks to queue');
      const videos = await this.youtubeSearch.getVideosFromPlaylist(url);
      
      this.jukebox.AddPlaylist(videos.map((video) => {return new Track(video.url ,video.metadata,
        interaction, this.client.user)}));
      return;
    }

    interaction.reply('Adding track to queue.');
    const youtubeTrack = await this.youtubeSearch.getVideoFromUrl(url);
    const track = new Track(youtubeTrack.url, youtubeTrack.metadata, interaction,  this.client.user);

    this.jukebox.PlayTrack(track);

    return;
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