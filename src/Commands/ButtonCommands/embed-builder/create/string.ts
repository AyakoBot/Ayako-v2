import type * as Discord from 'discord.js';

export default (cmd: Discord.ButtonInteraction, args: string[]) =>
 cmd.client.util.importCache.Commands.SelectCommands.StringSelect[
  'embed-builder'
 ].create.string.file.default(cmd, args);
