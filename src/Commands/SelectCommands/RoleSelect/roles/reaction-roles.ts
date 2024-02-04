import * as Discord from 'discord.js';

export default async (cmd: Discord.RoleSelectMenuInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.SelectCommands.RoleSelect.roles['button-roles'].file.default(
  cmd,
  args,
  'reaction-roles',
 );
