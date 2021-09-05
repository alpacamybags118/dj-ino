import { TYPES } from "./const/types";

import { Client, Interaction} from "discord.js";
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
    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if(interaction.isCommand()) {
        const command = this.commandList.findCommand(interaction.commandName)

        if(command) {
          await command.executeCommand(interaction);
        } else {
          interaction.channel?.send('Given command was not found');
        }
      } else {
        interaction.channel?.send('Interaction is not a command!');
      }
    });

    return this.client.login(this.token);
  }
}