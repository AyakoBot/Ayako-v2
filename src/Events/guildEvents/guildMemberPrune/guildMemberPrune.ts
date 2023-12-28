import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (entry: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 await ch.firstGuildInteraction(guild);

 log(entry, guild);
};
