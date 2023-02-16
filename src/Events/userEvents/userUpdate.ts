import type * as Discord from 'discord.js';
import { client } from '../../BaseClient/Client.js';

export default async (oldUser: Discord.User, user: Discord.User) => {
  const guilds = client.guilds.cache.filter((g) => g.members.cache.has(user.id));
  if (!guilds.size) return;

  const files: {
    default: (o: Discord.User, r: Discord.User, u: Discord.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  guilds.forEach((g) => files.forEach((f) => f.default(oldUser, user, g)));
};
