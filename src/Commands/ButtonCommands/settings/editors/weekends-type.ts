import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.ButtonCommands.settings.editors.shoptype.file.default(
  cmd,
  args,
  cmd.client.util.CT.EditorTypes.WeekendsType,
 );
