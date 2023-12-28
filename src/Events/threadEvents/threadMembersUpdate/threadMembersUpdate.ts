import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (
 added: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 removed: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 thread: Discord.ThreadChannel,
) => {
 await ch.firstGuildInteraction(thread.guild);

 log(added, removed, thread);
};
