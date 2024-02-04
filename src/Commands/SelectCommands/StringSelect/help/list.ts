import type * as Discord from 'discord.js';
import type * as CT from '../../../../SlashCommands/index.js';

export default async (cmd: Discord.StringSelectMenuInteraction) =>
 cmd.update(
  cmd.client.util.importCache.Commands.SlashCommands.help.list.file.getPayload(
   await cmd.client.util.getLanguage(cmd.guildId),
   cmd.values[0] as CT.CommandCategories,
   await cmd.client.util.importCache.Commands.SlashCommands.help.list.file.getCommands(
    cmd,
    cmd.values[0] as CT.CommandCategories,
   ),
  ) as Discord.InteractionUpdateOptions,
 );
