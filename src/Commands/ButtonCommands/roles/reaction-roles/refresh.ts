import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.ButtonCommands.roles['button-roles'].refresh.file.default(
  cmd,
  args,
  'reaction-roles',
 );
