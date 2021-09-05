# DJ-Ino

## Overview

This is a discord bot that will be used to play music for a server I am part of.

### Adding a Command

You can add a command by adding one file and modifying a file.

1. Adding the Command File
    1. Add you command file in the [commands](./src/commands) folder. it should follow the naming convention `commandNameCommand.ts`.
    2. Make sure it implements the `IBotCommand` interface. Here is a skeleton example:
    ```
      export default class MyCommand implements IBotCommand{
        name = 'mycommand'; // The name that the user will type in discord

      async executeCommand(interaction: CommandInteraction): Promise<any> {
        ...(implement command logic here)
      }

      buildCommand(): IBotCommandReturn {
        const command = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription('My description')
        ...

        return {
          data: command,
          execution: this.executeCommand
        };
      }
    }
    ```

2. Register the Command in DI
    1. Open the [ioc.config.ts](./src/config/ioc.config.ts) file. You will see a second for registering each command into the IOC container. Add an additional line before the `CommandContainer` registeration for your command. e.g.
    ```
    container.bind<IBotCommand>(TYPES.Command).toConstantValue(new MyCommand(...);
    ```

### Pushing Commands To Discord

Before you can use your new command, you must push it to your Discord server. In addition, you will need to add the JSON configuration of that command to [commands.json](./commands.json) to be picked up. See [this doc](https://canary.discord.com/developers/docs/interactions/slash-commands#registering-a-command) for Discord command schema reference.

You can then run `npm run deploy-commands` to push the commands to your Discord server.