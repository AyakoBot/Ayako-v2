import type * as Discord from 'discord.js';

export default (cmd: Discord.ButtonInteraction) =>
 cmd.client.util.importCache.Commands.ButtonCommands['embed-builder'].startOver.file.default(
  cmd,
  [],
  cmd.message.embeds[1].data,
 );
