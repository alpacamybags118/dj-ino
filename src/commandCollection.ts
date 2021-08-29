import { runInThisContext } from "vm";
import { IBotCommand } from "./commands/iBotCommand";
import MimicCommand from "./commands/mimicCommand";
import { Commands } from './config/commands.config'

export default class CommandCollection {
  commands: IBotCommand[]

  constructor() {
    this.commands = this.loadCommands();
  }

  loadCommands(): IBotCommand[] {
    return Commands.map((command) => { return new MimicCommand() })
  }
}