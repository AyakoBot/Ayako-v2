import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: { id: bigint; guildId: bigint; applicationId: bigint }) => {
  const guild = await client.cache.guilds.get(payload.guildId);
  if (!guild) return;

  const integration = client.integrations.get(guild.id)?.get(payload.id);

  const files: {
    default: (
      p: { id: bigint; guildId: bigint; applicationId: bigint },
      i: DDeno.Integration | undefined,
    ) => void;
  }[] = await Promise.all(['./log.js', './cache.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, integration));
};
