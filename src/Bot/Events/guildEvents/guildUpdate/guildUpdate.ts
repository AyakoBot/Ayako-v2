import type * as DDeno from 'discordeno';

export default async (guild: DDeno.Guild, oldGuild: DDeno.Guild) => {
  const files: {
    default: (g: DDeno.Guild, oG: DDeno.Guild) => void;
  }[] = await Promise.all(['./log.js'].map((p) => import(p)));

  files.forEach((f) => f.default(guild, oldGuild));
};
