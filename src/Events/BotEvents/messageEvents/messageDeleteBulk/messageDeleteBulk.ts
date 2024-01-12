import type * as Discord from 'discord.js';
import log from './log.js';

export default async (
 msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
 channel: Discord.GuildTextBasedChannel,
) => {
 log(msgs, channel);
};
