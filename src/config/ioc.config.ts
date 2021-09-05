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

const container = new Container();

// Discord specific objects
container.bind<Client>(TYPES.Client).toConstantValue(new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]}));
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN || '');


// Command DI
container.bind<AudioPlayer>(TYPES.AudioPlayer).toConstantValue(createAudioPlayer());
container.bind<IBotCommand>(TYPES.Command).toConstantValue(new MimicCommand());
container.bind<IBotCommand>(TYPES.Command).toConstantValue(new JoinVoiceCommand());
container.bind<IBotCommand>(TYPES.Command).toConstantValue(new PlayTrackCommand(container.get(TYPES.AudioPlayer)));
container.bind<IBotCommand>(TYPES.Command).toConstantValue(new PauseTrackCommand(container.get(TYPES.AudioPlayer)));
container.bind<IBotCommand>(TYPES.Command).toConstantValue(new ResumeTrackCommand(container.get(TYPES.AudioPlayer)));


container.bind(TYPES.CommandCollection).toConstantValue(new CommandCollection(container.getAll(TYPES.Command)));

// Bot DI
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();


export default container;