import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import {  AudioPlayer  } from "@discordjs/voice";
import { CommandInteraction} from "discord.js";

export default class PauseTrackCommand implements IBotCommand{
  constructor(private readonly audioPlayer: AudioPlayer){}
  
  async executeCommand(interaction: CommandInteraction): Promise<any> {
    interaction.reply('Pausing Audio');
    this.audioPlayer.pause()
    return Promise.resolve('hi');
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('DJ Ino will pause the current track, if one is playing')

    return {
      data: command,
      execution: this.executeCommand,
    };
  }
}