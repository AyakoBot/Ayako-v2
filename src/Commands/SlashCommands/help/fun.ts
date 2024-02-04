import * as Discord from 'discord.js';

export default (cmd: Discord.ChatInputCommandInteraction) =>
 cmd.client.util.helpHelpers.default(
  cmd,
  cmd.client.util.importCache.SlashCommands.file.CommandCategories.Fun,
 );
