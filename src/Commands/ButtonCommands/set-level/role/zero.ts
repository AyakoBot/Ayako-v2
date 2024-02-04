import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.ButtonCommands['set-level'].user.zero.file.default(
  cmd,
  args,
  'role',
 );
