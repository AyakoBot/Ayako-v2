import type * as Discord from 'discord.js';

export default async (
 msg: Discord.Message,
 reactions: Discord.Collection<string | Discord.Snowflake, Discord.MessageReaction>,
) => {
 if (!msg.inGuild()) return;

 msg.client.util.importCache.Events.BotEvents.messageEvents.messageReactionRemoveAll.log.file.default(
  msg,
  reactions,
 );
};
