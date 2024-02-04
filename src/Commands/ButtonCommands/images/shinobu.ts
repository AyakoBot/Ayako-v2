import * as Discord from 'discord.js';

export default (cmd: Discord.ButtonInteraction) =>
 cmd.client.util.importCache.BaseClient.UtilModules.getGif.file.imageGetter(cmd);
