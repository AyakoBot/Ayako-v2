import type DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msgs: DDeno.Message[]) => {
  if (!msgs) return;

  const firstMsg = msgs[0];
  if (!firstMsg.guildId) return;

  const guild = await client.ch.cache.guilds.get(firstMsg.guildId);
  if (!guild) return;

  msgs.forEach((m) => {
    if (!m.guildId) return;
    const cached = client.ch.cache.messages.cache.get(m.guildId)?.get(m.channelId)?.get(m.id);
    if (cached) m = cached;
    client.ch.cache.messages.delete(m.id);
  });

  const files: { default: (t: DDeno.Message[], g: DDeno.Guild) => void }[] = await Promise.all(
    ['./log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(msgs, guild));
};
