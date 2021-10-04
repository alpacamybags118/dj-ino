import { CommandInteraction } from "discord.js";
import { YoutubeMetadata } from "./youtubeMetadata";

export default class Track {
  url: string;
  metadata: YoutubeMetadata;
  onStart: any;
  onEnd: any;
  interaction: CommandInteraction

  constructor(url: string, onStart: any, onEnd: any, metadata: YoutubeMetadata, interaction: CommandInteraction) {
    this.url = url;
    this.onEnd = onEnd;
    this.onStart = onStart;
    this.metadata = metadata;
    this.interaction = interaction;
  }
}
