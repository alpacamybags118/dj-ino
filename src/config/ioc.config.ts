import "reflect-metadata";

import {TYPES} from '../const/types'
import Bot from "../bot"

import { Container } from "inversify";
import { Client } from 'discord.js'
import CommandCollection from "../commandCollection";
import { AudioPlayer, createAudioPlayer } from "@discordjs/voice";
import { create } from "domain";

const container = new Container();

container.bind<AudioPlayer>(TYPES.AudioPlayer).toConstantValue(createAudioPlayer());
container.bind(TYPES.CommandCollection).toConstantValue(new CommandCollection(container.get(TYPES.AudioPlayer)));
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]}));
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN || '');

export default container;