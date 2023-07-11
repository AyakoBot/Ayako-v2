import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';
import log from './log.js';
import cache from './cache.js';

export default async (data: Discord.ApplicationCommandPermissionsUpdateData) => {
 if (!data.guildId) return;

 const guild = client.guilds.cache.get(data.guildId);
 if (!guild) return;

 log(data, guild);
 cache(data, guild);
};
