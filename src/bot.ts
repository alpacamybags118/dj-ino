import { TYPES } from "./const/types";

import { Client, Collection, Interaction, Message } from "discord.js";
import { inject, injectable } from "inversify";
import CommandCollection from "./commandCollection";

@injectable()
export default class Bot {
  private client: Client;
  private readonly token: string;
  private readonly commandList: CommandCollection

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.CommandCollection) commandList: CommandCollection
  ) {
    this.client = client;
    this.token = token;
    this.commandList = commandList;
  }
  public async listen(): Promise<string> {
    this.client.on('interactionCreate', async (interaction: any) => {
      const command = this.commandList.commands.find(x => x.buildCommand().data.toJSON().name == interaction.commandName)

      if(command) {
        await command.executeCommand(interaction);
      }
    });

    return this.client.login(this.token);
  }
}