import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.importCache.Commands.SlashCommands.leaderboard.server.file.default(cmd);
