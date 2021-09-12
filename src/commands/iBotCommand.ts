import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";

export interface IBotCommandReturn {
  data: any,
  execution: any
}

export interface IBotCommand {
  name: string;
  
  buildCommand(): IBotCommandReturn
  executeCommand(interaction: Interaction): Promise<void>
}

