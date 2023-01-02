import type DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msg: DDeno.Message) => {
  if (!msg.guildId) return;

  client.ch.query(`DELETE FROM giveaways WHERE msgid = $1;`, [String(msg.id)]);

  const guildGiveawayCache = client.giveaways.get(msg.guildId);
  guildGiveawayCache?.get(msg.id)?.cancel();

  if (guildGiveawayCache?.size === 1) client.giveaways.delete(msg.guildId);
  else guildGiveawayCache?.delete(msg.id);
};
