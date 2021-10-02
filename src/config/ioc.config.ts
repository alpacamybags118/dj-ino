import "reflect-metadata";

import {TYPES} from '../const/types'
import PauseTrackCommand from "../commands/pauseTrackCommand";
import ResumeTrackCommand from "../commands/resumeTrackCommand";
import MimicCommand from "../commands/mimicCommand";
import JoinVoiceCommand from "../commands/joinVoiceCommand";
import PlayTrackCommand from "../commands/playTrackCommand";
import Bot from "../bot"

import { Container } from "inversify";
import { Client } from 'discord.js'
import CommandCollection from "../commandCollection";
import { AudioPlayer, createAudioPlayer } from "@discordjs/voice";
import { IBotCommand } from "../commands/iBotCommand";
import JukeBox from "../media/jukebox";
import YoutubeDownloader from "../media/youtubeDownloader";
import ListQueueCommand from "../commands/listQueueCommand";
import SkipTrackCommand from "../commands/skipTrackCommand";
import TrackQueue from "../media/trackQueue";
import YoutubeSearch from "../media/youtubeSearch";

const container = new Container();

// Discord specific objects
container.bind<Client>(TYPES.Client).toConstantValue(new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]}));
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN || '');

// Media DI
container.bind<YoutubeDownloader>(TYPES.YoutubeDownloader).to(YoutubeDownloader);
container.bind<AudioPlayer>(TYPES.AudioPlayer).toConstantValue(createAudioPlayer());
container.bind<TrackQueue>(TYPES.TrackQueue).to(TrackQueue).inSingletonScope();
container.bind<JukeBox>(TYPES.Jukebox).to(JukeBox).inSingletonScope()
container.bind<YoutubeSearch>(TYPES.YoutubeSearch).to(YoutubeSearch).inSingletonScope()



// Command DI
container.bind<IBotCommand>(TYPES.Command).to(MimicCommand);
container.bind<IBotCommand>(TYPES.Command).to(JoinVoiceCommand);
container.bind<IBotCommand>(TYPES.Command).to(PlayTrackCommand);
container.bind<IBotCommand>(TYPES.Command).to(PauseTrackCommand);
container.bind<IBotCommand>(TYPES.Command).to(ResumeTrackCommand);
container.bind<IBotCommand>(TYPES.Command).to(ListQueueCommand);
container.bind<IBotCommand>(TYPES.Command).to(SkipTrackCommand);


container.bind(TYPES.CommandCollection).toConstantValue(new CommandCollection(container.getAll(TYPES.Command)));

// Bot DI
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();


export default container;