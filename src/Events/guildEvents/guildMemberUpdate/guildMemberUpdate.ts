import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (member: DDeno.Member, user: DDeno.User, oldMember: DDeno.Member) => {
  const guild = await client.ch.cache.guilds.get(member.guildId);
  if (!guild) return;

  const cached = client.ch.cache.members.cache.get(member.guildId)?.get(user.id);
  if (cached) oldMember = cached;
  client.ch.cache.members.delete(user.id, member.guildId);

  const files: {
    default: (m: DDeno.Member, t: DDeno.User, g: DDeno.Guild, o: DDeno.Member) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(member, user, guild, oldMember));
};
