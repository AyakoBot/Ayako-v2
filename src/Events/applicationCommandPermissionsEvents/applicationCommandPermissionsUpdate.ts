import type * as Discord from 'discord.js';
import { client } from '../../BaseClient/Client.js';

export default async (data: Discord.ApplicationCommandPermissionsUpdateData) => {
  if (!data.guildId) return;

  const guild = client.guilds.cache.get(data.guildId);
  if (!guild) return;

  const files: {
    default: (t: Discord.ApplicationCommandPermissionsUpdateData, g: Discord.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(data, guild));
};
