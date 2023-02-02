import type * as Discord from 'discord.js';

export default async (oldRole: Discord.Role, role: Discord.Role) => {
  if (oldRole.position !== role.position) return;

  const files: {
    default: (r: Discord.Role, t: Discord.Role) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldRole, role));
};
