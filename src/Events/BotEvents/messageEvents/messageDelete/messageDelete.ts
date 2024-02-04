import type * as Discord from 'discord.js';

export default async (msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 msg.client.util.importCache.Events.BotEvents.messageEvents.messageDelete.log.file.default(msg);
 msg.client.util.importCache.Events.BotEvents.messageEvents.messageDelete.cache.file.default(msg);
};
