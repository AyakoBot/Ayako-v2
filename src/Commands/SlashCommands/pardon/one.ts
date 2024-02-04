import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.importCache.Commands.SlashCommands.mod.pardon.one.file.default(cmd);
