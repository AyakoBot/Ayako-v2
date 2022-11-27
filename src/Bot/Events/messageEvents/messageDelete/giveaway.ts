import type DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (msg: DDeno.Message) => {
  client.ch.query(`DELETE FROM giveaways WHERE msgid = $1;`, [String(msg.id)]);

  const g = client.giveaways.get(`${msg.id}-${msg.guildId}`);
  if (g) {
    g.cancel();
    client.giveaways.delete(`${msg.id}-${msg.guildId}`);
  }
};
