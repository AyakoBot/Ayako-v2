import type * as Discord from 'discord.js';
import log from './log.js';

export default async (channel: Discord.GuildChannel) => {
 log(channel);
};
