import type * as Discord from 'discord.js';
import log from './log.js';
import welcomeGifChannel from './welcomeGifChannel.js';

export default async (
 msgs: Discord.Collection<Discord.Snowflake, Discord.Message>,
 channel: Discord.GuildTextBasedChannel,
) => {
 welcomeGifChannel(msgs, channel)
 log(msgs, channel);
};
