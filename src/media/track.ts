import { ClientUser, CommandInteraction } from "discord.js";
import { YoutubeMetadata } from "./youtubeMetadata";

export default class Track {
  url: string;
  metadata: YoutubeMetadata;
  interaction: CommandInteraction;
  user: ClientUser;

  constructor(url: string, metadata: YoutubeMetadata, interaction: CommandInteraction, user: ClientUser) {
    this.url = url;
    this.metadata = metadata;
    this.interaction = interaction;
    this.user = user;
  }

  public async OnStart(): Promise<void> {
    this.user.setPresence({
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
    this.user.setPresence({activities: undefined});
    await this.interaction.channel.send(`Finished ${this.metadata.title}`)
  }
}
