import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';

export default async (data: Discord.ApplicationCommandPermissionsUpdateData) => {
 if (!data.guildId) return;

 const guild = client.guilds.cache.get(data.guildId);
 if (!guild) return;

 await client.util.firstGuildInteraction(guild);

 client.util.importCache.Events.BotEvents.applicationCommandPermissionsEvents.log.file.default(
  data,
  guild,
 );
 client.util.importCache.Events.BotEvents.applicationCommandPermissionsEvents.cache.file.default(
  data,
  guild,
 );
};
