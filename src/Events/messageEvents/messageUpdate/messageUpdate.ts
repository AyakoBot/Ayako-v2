import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (msg: DDeno.Message, oldMsg?: DDeno.Message) => {
  if (!oldMsg) return;

  const files: {
    default: (t: DDeno.Message, t2: DDeno.Message | undefined) => void;
  }[] = await Promise.all(
    (msg.guild.id ? ['./log.js', './editCommand.js'] : ['./editCommand.js']).map((p) => import(p)),
  );

  const cached = msg.guild.id
    ? client.ch.cache.messages.cache.get(msg.guild.id)?.get(msg.channelId)?.get(msg.id)
    : undefined;
  if (cached) oldMsg = cached;
  client.ch.cache.messages.delete(msg.id);

  files.forEach((f) => f.default(msg, oldMsg));
};
