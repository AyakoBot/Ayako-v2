import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (msg: Discord.Message) => {
  if (!msg.guild) return;

  client.ch.cache.giveaways.delete(msg.guild.id, msg.channelId, msg.id);

  const files: {
    default: (s: Discord.Message) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(msg));
};
