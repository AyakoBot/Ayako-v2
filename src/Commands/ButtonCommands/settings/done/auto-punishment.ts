import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.ButtonCommands.settings.done.shoptype.file.default(
  cmd,
  args,
  cmd.client.util.CT.EditorTypes.AutoPunishment,
 );
