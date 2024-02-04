import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction) =>
 cmd.client.util.importCache.Commands.ButtonCommands.suggestion.accept.file.default(cmd, [], false);
