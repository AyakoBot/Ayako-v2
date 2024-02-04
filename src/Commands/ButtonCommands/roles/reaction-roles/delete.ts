import * as Discord from 'discord.js';

export default (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.ButtonCommands.roles['button-roles'].delete.file.default(
  cmd,
  args,
  'reaction-roles',
 );
