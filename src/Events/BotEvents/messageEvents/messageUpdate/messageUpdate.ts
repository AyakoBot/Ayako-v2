import type * as Discord from 'discord.js';

export default async (oldMsg: Discord.Message, msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 msg.client.util.importCache.Events.BotEvents.messageEvents.messageUpdate.log.file.default(
  oldMsg,
  msg,
 );
 msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.commandHandler.file.default(
  msg,
 );
};
