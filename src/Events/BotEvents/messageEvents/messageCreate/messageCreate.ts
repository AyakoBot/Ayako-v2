import type * as Discord from 'discord.js';

export default async (msg: Discord.Message) => {
 if (!msg) return;
 if (!msg.author) return;

 if (msg.inGuild()) {
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.eval.file.default(msg);
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.other.file.default(msg);
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.revengePing.file.default(
   msg,
  );
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.stickyMessage.file.default(
   msg,
  );
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.afk.file.default(msg);
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.levelling.file.default(
   msg,
  );
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.invites.file.default(
   msg,
  );
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.newlines.file.default(
   msg,
  );
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.disboard.file.default(
   msg,
  );
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.antispam.file.default(
   msg,
  );
 } else {
  msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.dmLog.file.default(msg);
 }

 msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.tta.file.default(msg);
 msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.execute.file.default(msg);
 msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.commandHandler.file.default(
  msg,
 );
 msg.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.antivirus.file.default(
  msg,
 );
};
