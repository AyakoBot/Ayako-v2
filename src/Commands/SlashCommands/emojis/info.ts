import * as Discord from 'discord.js';

export default (cmd: Discord.ChatInputCommandInteraction, args: string[], page: number) =>
 cmd.client.util.importCache.Commands.SlashCommands.info.emoji.file.default(cmd, args, page);
