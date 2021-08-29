require('dotenv').config();

import container from './config/ioc.config'
import { TYPES } from './const/types'
import Bot from './bot'

const bot = container.get<Bot>(TYPES.Bot);

bot.listen().then(() => {
  console.log('Logged in!')
}).catch((err) => {
  console.log('Error', err);
});