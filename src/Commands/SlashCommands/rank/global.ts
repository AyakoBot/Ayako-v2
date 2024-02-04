import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.importCache.Commands.SlashCommands.leaderboard.global.file.default(cmd);
