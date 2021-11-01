# Development

## Stack Overview

This bot is build with the following technologies:
1. Typescript
2. Nodejs (16+)
3. discord.js library
4. yt-dlp for streaming video data

### Environment Variables
This app uses `dotenv` to inject environment variables at start time. For development, add a `.env` file to the root of the repo. It should contain the following variables

1. TOKEN: The token for the bot. This can be found in the Discord Developer Portal.
2. CLIENT_ID: Client ID for the bot. This can be found in the Discord Developer Portal.
3. GUILD_ID: The server ID you wish to connect the bot to. See [this doc](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) on instructions on getting this data
4. YOUTUBE_API_BASE_URL: Base URL for Youtube API. Can be obtained from the API Catalog in Google Cloud.
5. YOUTUBE_API_KEY: Your API key for hitting the Youtube API.


### Commands

1. `npm run watch`: Watches for file changes for re-transpiles
2. `npm run build`: Transiples once
3. `npm run start`: Runs the bot in dev mode
4. `npm run start:prod`: Runs the bot in dev mode
5. `npm run test:unit`: Runs unit tests
6. `npm run test:integration`: Runs integration tests
7. `npm run deploy-commands`: Deploys bot commands to server based on GUILD_ID environment variable. See [below docs](#Pushing-Commands-To-Discord) for more details



## Guides
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