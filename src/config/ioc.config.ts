import "reflect-metadata";

import {TYPES} from '../const/types'
import Bot from "../bot"

import { Container } from "inversify";
import { Client } from 'discord.js'
import CommandCollection from "../commandCollection";

const container = new Container();

container.bind(TYPES.CommandCollection).toConstantValue(new CommandCollection());
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client({intents: ["GUILDS", "GUILD_MESSAGES"]}));
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN || '');

export default container;