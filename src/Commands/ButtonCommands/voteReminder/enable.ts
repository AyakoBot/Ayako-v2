import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.ButtonCommands.voteReminder.disable.file.default(
  cmd,
  args,
  true,
 );
