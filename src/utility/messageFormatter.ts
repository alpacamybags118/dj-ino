import { MessageEmbed } from "discord.js";
import { YoutubeMetadata } from "../media/youtubeMetadata";

export default class MessageFormatter {
  static MakeFormattedDiscordMessage(trackUrl: string, trackMetadata: YoutubeMetadata): MessageEmbed {
    return new MessageEmbed()
    .setTitle(`${trackMetadata.title}`)
    .setURL(trackUrl)
    .setImage(trackMetadata.thumbnails.standard ? trackMetadata.thumbnails.standard.url : trackMetadata.thumbnails.default.url)
    .setDescription(trackMetadata.description);
  }
}