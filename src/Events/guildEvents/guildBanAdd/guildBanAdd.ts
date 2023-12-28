import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (ban: Discord.GuildBan) => {
 await ch.firstGuildInteraction(ban.guild);

 log(ban);
};
