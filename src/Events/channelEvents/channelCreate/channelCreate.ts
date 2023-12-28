import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (channel: Discord.GuildChannel) => {
 await ch.firstGuildInteraction(channel.guild);

 log(channel);
};
