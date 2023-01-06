import type DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msgs: DDeno.Message[]) => {
  if (!msgs) return;

  const firstMsg = msgs[0];
  if (!firstMsg.guildId) return;

  const guild = await client.cache.guilds.get(firstMsg.guildId);
  if (!guild) return;

  const files: { default: (t: DDeno.Message[], g: DDeno.Guild) => void }[] = await Promise.all(
    ['./log.js'].map((p) => import(p)),
  );

  files.forEach((f) => f.default(msgs, guild));
};
