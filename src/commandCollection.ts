import { runInThisContext } from "vm";
import { IBotCommand } from "./commands/iBotCommand";
import MimicCommand from "./commands/mimicCommand";
import JoinVoiceCommand from "./commands/joinVoiceCommand";
import { Commands } from './config/commands.config'

export default class CommandCollection {
  commands: IBotCommand[]

  constructor() {
    this.commands = this.loadCommands();
  }

  // todo, make this dynamically get each bot config
  loadCommands(): IBotCommand[] {
    return [new MimicCommand(), new JoinVoiceCommand()];
  }
}