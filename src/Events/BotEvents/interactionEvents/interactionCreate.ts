import type * as Discord from 'discord.js';

export default async (cmd: Discord.Interaction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 cmd.client.util.importCache.Events.BotEvents.interactionEvents.interactionCreate.commandHandler.file.default(
  cmd,
 );
 cmd.client.util.importCache.Events.BotEvents.interactionEvents.interactionCreate.buttonHandler.file.default(
  cmd,
 );
 cmd.client.util.importCache.Events.BotEvents.interactionEvents.interactionCreate.modalHandler.file.default(
  cmd,
 );
 cmd.client.util.importCache.Events.BotEvents.interactionEvents.interactionCreate.contextCommandHandler.file.default(
  cmd,
 );
 cmd.client.util.importCache.Events.BotEvents.interactionEvents.interactionCreate.selectHandler.file.default(
  cmd,
 );
 cmd.client.util.importCache.Events.BotEvents.interactionEvents.interactionCreate.autocompleteHandler.file.default(
  cmd,
 );
};
