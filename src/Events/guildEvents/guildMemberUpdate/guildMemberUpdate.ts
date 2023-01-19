import type * as Discord from 'discord.js';

export default async (oldMember: Discord.GuildMember, member: Discord.GuildMember) => {
  const files: {
    default: (m: Discord.GuildMember, o: Discord.GuildMember) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(oldMember, member));
};
