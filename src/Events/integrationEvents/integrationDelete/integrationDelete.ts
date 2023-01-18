import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (payload: { id: bigint; guildId: bigint; applicationId: bigint }) => {
  const guild = await client.ch.cache.guilds.get(payload.guildId);
  if (!guild) return;

  const integration = client.ch.cache.integrations.cache.get(guild.id)?.get(payload.id);
  client.ch.cache.integrations.delete(payload.id);

  const files: {
    default: (
      p: { id: bigint; guildId: bigint; applicationId: bigint },
      i: DDeno.Integration | undefined,
    ) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload, integration));
};
