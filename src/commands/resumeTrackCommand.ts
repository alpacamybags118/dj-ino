import { IBotCommand, IBotCommandReturn } from "./iBotCommand";

import { SlashCommandBuilder } from "@discordjs/builders";
import {  AudioPlayer  } from "@discordjs/voice";
import { CommandInteraction} from "discord.js";

export default class ResumeTrackCommand implements IBotCommand{
  constructor(private readonly audioPlayer: AudioPlayer){}
  
  async executeCommand(interaction: CommandInteraction): Promise<any> {
    interaction.reply('Resuming Audio');
    this.audioPlayer.unpause()
    return Promise.resolve('hi');
  }

  buildCommand(): IBotCommandReturn {
    const command = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('DJ Ino will resume playing')

    return {
      data: command,
      execution: this.executeCommand,
    };
  }
}