import * as Discord from 'discord.js';

export default (cmd: Discord.ButtonInteraction) =>
 cmd.client.util.importCache.Commands.ButtonCommands.suggestion.tick.file.default(cmd, [], false);
