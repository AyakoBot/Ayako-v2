import * as Discord from 'discord.js';

export default (cmd: Discord.ChatInputCommandInteraction<'cached'>, args: string[]) =>
 cmd.client.util.importCache.Commands.SlashCommands.emojis.create['from-file'].file.default(
  cmd,
  args,
  'sticker',
 );
