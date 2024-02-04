import type * as Discord from 'discord.js';

export default async (
 msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
 channel: Discord.GuildTextBasedChannel,
) => {
 channel.client.util.importCache.Events.BotEvents.messageEvents.messageDeleteBulk.log.file.default(
  msgs,
  channel,
 );
};
