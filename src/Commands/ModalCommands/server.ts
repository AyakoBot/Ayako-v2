import * as Discord from 'discord.js';

export default async (cmd: Discord.ModalSubmitInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.isFromMessage()) return;

 cmd.client.util.importCache.Commands.SlashCommands.server.list.file.default(
  cmd,
  [],
  Number(cmd.fields.getTextInputValue('page')),
 );
};
