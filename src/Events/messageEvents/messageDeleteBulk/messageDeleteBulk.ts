import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (msgs: DDeno.Message[]) => {
  if (!msgs) return;

  const firstMsg = msgs[0];
  if (!firstMsg.guild.id) return;

  const guild = await client.ch.cache.guilds.get(firstMsg.guild.id);
  if (!guild) return;

  msgs.forEach((m) => {
    if (!m.guild.id) return;
    const cached = client.ch.cache.messages.cache.get(m.guild.id)?.get(m.channelId)?.get(m.id);
    if (cached) m = cached;
    client.ch.cache.messages.delete(m.id);
  });

  const files: { default: (t: DDeno.Message[], g: DDeno.Guild) => void }[] = await Promise.all(
    ['./log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(msgs, guild));
};
