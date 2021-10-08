import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection} from "@discordjs/voice";
import { Client, CommandInteraction} from "discord.js";
import { inject, injectable } from "inversify";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";
import Track from "../media/track";
import YoutubeSearch from "../media/youtubeSearch";
import YouTubeMetadata, { YoutubeMetadata } from "../media/youtubeMetadata";

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
    const connection = getVoiceConnection(interaction.guildId || '');
    const url = interaction.options.getString('track') || ''
    console.log(connection);
    if (connection == undefined) {
      interaction.reply('DJ Ino is not connected to a voice channel!');
      return;
    }

    this.jukebox.subscribeToJukebox(connection);

    if(YoutubeSearch.isPlaylistUrl(url)) {
      interaction.reply('Playlist detected. Adding all tracks to queue');
      const videoIds = await this.youtubeSearch.getVideosFromPlaylist(url);
      
      //TODO: make this work
      const tracks = videoIds.map((id) => {
        const trackUrl = `https://www.youtube.com/watch?v=${id}`
        const trackMetadata = {
          title: 'test',
          thumbnails: {},
        }
        return new Track(trackUrl, trackMetadata, interaction, this.client);
      });

      this.jukebox.AddPlaylist(tracks);
      return;
    }

    interaction.reply('Adding track to queue.');

    //TODO: two types of yt urls, move this code
    let id = ''
    const urlPart = url.split('=')
    if(urlPart.length == 1) {
      id = url.split('.be/')[1]
    } else {
      id = urlPart[1]
    }
    const trackMetadata = await YouTubeMetadata.GetMetadataForVideo(id);
    const track = new Track(url, trackMetadata, interaction,  this.client);


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