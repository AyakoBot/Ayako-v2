import * as Discord from 'discord.js';

export default (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.importCache.BaseClient.UtilModules.getGif.file.imageGetter(cmd);
