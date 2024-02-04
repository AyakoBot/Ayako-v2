import type * as Discord from 'discord.js';

export default async (
 added: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 removed: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 thread: Discord.ThreadChannel,
) => {
 thread.client.util.importCache.Events.BotEvents.threadEvents.threadMembersUpdate.log.file.default(
  added,
  removed,
  thread,
 );
};
