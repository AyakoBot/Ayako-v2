import client from 'Bot/BaseClient/DDenoClient.js';
import type * as DDeno from 'discordeno';

export default async (member: DDeno.Member, user: DDeno.User) => {
  const files: {
    default: (m: DDeno.Member, t: DDeno.User, g: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  const guild = await client.cache.guilds.get(member.guildId);
  if (!guild) return;

  files.forEach((f) => f.default(member, user, guild));
};
