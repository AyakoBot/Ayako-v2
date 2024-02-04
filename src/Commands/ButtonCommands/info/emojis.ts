import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.SlashCommands.info.emoji.file.default(
  cmd,
  [],
  Number(args.shift()),
 );
