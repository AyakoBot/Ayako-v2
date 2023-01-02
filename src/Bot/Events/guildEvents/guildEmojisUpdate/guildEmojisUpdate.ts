import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: {
  guildId: bigint;
  emojis: DDeno.Collection<bigint, DDeno.DiscordEmoji>;
}) => {
  const addedEmote = payload.emojis.find((e) => (e.id ? !client.emojis.get(BigInt(e.id)) : false));
  const emoteCache = client.emojis.get(payload.guildId);
  const removedEmote = emoteCache
    ? Array.from(emoteCache, ([, emoji]) => emoji).find((e) =>
        e.id ? !payload.emojis.get(BigInt(e.id)) : false,
      )
    : undefined;
  const changedEmote = payload.emojis.find((e) =>
    e.id
      ? JSON.stringify(e) !== JSON.stringify(client.emojis.get(payload.guildId)?.get(BigInt(e.id)))
      : false,
  );

  if (!addedEmote && !removedEmote && !changedEmote) return;

  const guild = await client.cache.guilds.get(payload.guildId);
  if (!guild) return;

  if (addedEmote) (await import('./emojiCreate/emojiCreate.js')).default(addedEmote, guild);
  if (removedEmote) (await import('./emojiDelete/emojiDelete.js')).default(removedEmote, guild);
  if (changedEmote && changedEmote.id) {
    const beforeEmote = client.emojis.get(payload.guildId)?.get(BigInt(changedEmote.id));
    (await import('./emojiUpdate/emojiUpdate.js')).default(changedEmote, beforeEmote, guild);
  }
};
