import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (user: DDeno.User) => {
  const members = client.ch.cache.members.find(user.id);
  if (!members?.length) return;

  const guilds = (
    await Promise.all(members.map((m) => client.ch.cache.guilds.get(m.guild.id)))
  ).filter((g): g is DDeno.Guild => !!g);

  const cached = client.users.cache.cache.get(user.id);
  client.users.cache.set(user);

  const files: {
    default: (t: DDeno.User, r: DDeno.User | undefined, g: DDeno.Guild[]) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  if (!guilds.length) return;

  files.forEach((f) => f.default(user, cached, guilds));
};
