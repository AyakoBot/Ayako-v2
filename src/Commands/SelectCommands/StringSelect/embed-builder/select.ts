import * as Discord from 'discord.js';

export default async (cmd: Discord.StringSelectMenuInteraction<'cached'>) =>
 cmd.client.util.importCache.Commands.SlashCommands['embed-builder'].create.file.buildEmbed(
  cmd,
  cmd.values[0],
 );
