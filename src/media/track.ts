import { Client, CommandInteraction } from "discord.js";
import { YoutubeMetadata } from "./youtubeMetadata";

export default class Track {
  url: string;
  metadata: YoutubeMetadata;
  interaction: CommandInteraction;
  client: Client;

  constructor(url: string, metadata: YoutubeMetadata, interaction: CommandInteraction, client: Client) {
    this.url = url;
    this.metadata = metadata;
    this.interaction = interaction;
    this.client = client;
  }

  public async OnStart(): Promise<void> {
    this.client.user?.setPresence({
      activities: [{
        name: `${this.metadata.title}`,
        type: 'LISTENING'
      }
      ]
    })
    await this.interaction.channel.send(`Playing ${this.metadata.title} \
    ${this.url}`)
  }

  public async OnEnd(): Promise<void> {
    this.client.user?.setPresence({activities: undefined});
    await this.interaction.channel.send(`Finished ${this.metadata.title}`)
  }
}
