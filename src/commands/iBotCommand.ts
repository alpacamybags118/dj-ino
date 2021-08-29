import { SlashCommandBuilder } from "@discordjs/builders";

export interface IBotCommandReturn {
  data: any,
  execution: any
}

export interface IBotCommand {
  buildCommand(): IBotCommandReturn
  executeCommand(interaction: any): Promise<any>
}

