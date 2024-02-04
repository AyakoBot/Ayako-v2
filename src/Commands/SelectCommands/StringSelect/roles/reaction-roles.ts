import * as Discord from 'discord.js';

export default (cmd: Discord.StringSelectMenuInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.SelectCommands.StringSelect.roles[
  'button-roles'
 ].file.default(cmd, args, 'reaction-roles');
