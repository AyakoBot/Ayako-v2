import * as Discord from 'discord.js';

export default (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.BaseClient.UtilModules.interactionHelpers.file.react(cmd, args);
