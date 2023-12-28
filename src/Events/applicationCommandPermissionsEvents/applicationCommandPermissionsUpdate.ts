import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import cache from './cache.js';
import log from './log.js';

export default async (data: Discord.ApplicationCommandPermissionsUpdateData) => {
 if (!data.guildId) return;

 const guild = client.guilds.cache.get(data.guildId);
 if (!guild) return;

 await ch.firstGuildInteraction(guild);

 log(data, guild);
 cache(data, guild);
};
