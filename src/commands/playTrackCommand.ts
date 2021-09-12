import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection} from "@discordjs/voice";
import { Client, CommandInteraction} from "discord.js";
import { inject, injectable } from "inversify";
import JukeBox from "../media/jukebox";
import { TYPES } from "../const/types";
import Track from "../media/track";

@injectable()
export default class PlayTrackCommand implements IBotCommand {
  private client: Client
  private jukebox: JukeBox

  name = 'playtrack';

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Jukebox) jukeBox: JukeBox
    ){
    this.client = client;
    this.jukebox = jukeBox;
  }
  
  async executeCommand(interaction: CommandInteraction, ): Promise<void> {
    const connection = getVoiceConnection(interaction.guildId || '');
    const trackUrl = interaction.options.getString('track') || ''
    console.log(connection);
    if (connection == undefined) {
      interaction.reply('DJ Ino is not connected to a voice channel!');
      return;
    }

    interaction.reply('Adding track to queue.');
    const track = new Track(trackUrl,
      async () => {
        this.client.user?.setPresence({
          activities: [{
            name: `to ${track.url}`,
            type: 'LISTENING'
          }
          ]
        })
        await interaction.followUp(`Playing ${trackUrl}`)
      },
      async () => {
        await interaction.followUp(`Finished ${trackUrl}`)
      })

    this.jukebox.subscribeToJukebox(connection);
    this.jukebox.PlayTrack(track);
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