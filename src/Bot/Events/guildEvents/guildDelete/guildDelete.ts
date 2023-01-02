import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (guildId: bigint) => {
  const guild = await client.cache.guilds.get(guildId);

  const files: {
    default: (id: bigint, g: DDeno.Guild | undefined) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(guildId, guild));
};
