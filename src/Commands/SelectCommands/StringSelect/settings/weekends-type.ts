import type * as Discord from 'discord.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.SelectCommands.StringSelect.settings.shoptype.file.default(
  cmd,
  args,
  cmd.client.util.CT.EditorTypes.WeekendsType,
 );
