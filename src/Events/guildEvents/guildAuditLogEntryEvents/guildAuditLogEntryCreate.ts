import * as Discord from 'discord.js';
import log from './log.js';

export default async (entry: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 console.log(entry);
 log(entry, guild);
};
