import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection} from "@discordjs/voice";
import { Client, CommandInteraction} from "discord.js";
import { inject, injectable } from "inversify";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";
import Track from "../media/track";
import YoutubeSearch from "../media/youtubeSearch";

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

      const tracks = videoIds.map((id) => {
        const trackUrl = `https://www.youtube.com/watch?v=${id}`
        return this.createTrack(trackUrl, interaction);
      });

      this.jukebox.AddPlaylist(tracks);
      return;
    }

    interaction.reply('Adding track to queue.');
    const track = this.createTrack(url, interaction);


    this.jukebox.PlayTrack(track);

    return;
  }

  // TODO: move this code somewhere else
  private createTrack(url: string, interaction: CommandInteraction): Track {
    const track = new Track(url,
      async () => {
        this.client.user?.setPresence({
          activities: [{
            name: `${track.url}`,
            type: 'LISTENING'
          }
          ]
        })
        await interaction.followUp(`Playing ${url}`)
      },
      async () => {
        this.client.user?.setPresence({activities: undefined});
        await interaction.followUp(`Finished ${url}`)
      });

      return track;
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