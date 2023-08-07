import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (log: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 ch.cache.auditLogs.set(guild.id, log);
};
