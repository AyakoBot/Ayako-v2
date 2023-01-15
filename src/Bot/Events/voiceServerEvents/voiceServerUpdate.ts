import client from '../../BaseClient/DDenoClient.js';

export default async (payload: { token: string; endpoint?: string; guildId: bigint }) => {
  const guild = await client.ch.cache.guilds.get(payload.guildId);
  if (!guild) return;

  const files: {
    default: (p: typeof payload) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(payload));
};
