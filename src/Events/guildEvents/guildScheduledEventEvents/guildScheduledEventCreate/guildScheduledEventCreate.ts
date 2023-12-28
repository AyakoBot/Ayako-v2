import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (event: Discord.GuildScheduledEvent) => {
 if (!event.guild) return;

 await ch.firstGuildInteraction(event.guild);

 log(event);
};
