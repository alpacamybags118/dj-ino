import { TYPES } from "./const/types";

import { Client, Interaction} from "discord.js";
import { inject, injectable } from "inversify";
import CommandCollection from "./commandCollection";
import Logger from "./utility/logger";

@injectable()
export default class Bot {
  private client: Client;
  private readonly token: string;
  private readonly commandList: CommandCollection
  private readonly logger: Logger

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.CommandCollection) commandList: CommandCollection,
    @inject(TYPES.Logger) logger: Logger

  ) {
    this.client = client;
    this.token = token;
    this.commandList = commandList;
    this.logger = logger;
  }
  public async listen(): Promise<string> {
    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if(interaction.isCommand()) {
        const command = this.commandList.findCommand(interaction.commandName)

        if(command) {
          try {
            await command.executeCommand(interaction);
          }
          catch(e) {
            this.logger.Error(e);
            interaction.channel?.send('DJ Ino encountered an error while processing command. Please see logs for details');
          }
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