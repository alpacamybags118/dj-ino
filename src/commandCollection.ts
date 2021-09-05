import { IBotCommand } from "./commands/iBotCommand";

export default class CommandCollection {
  constructor(private readonly commandList: IBotCommand[]){}

  findCommand(name: string): IBotCommand | undefined {
    return this.commandList.find(item => item.name == name);
  }
}