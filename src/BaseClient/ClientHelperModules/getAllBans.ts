import type * as Discord from 'discord.js';

export default async (guild: Discord.Guild) => {
 const fetchBans = (after?: string) =>
  guild.bans.fetch({ limit: 1000, after }).catch(() => undefined);

 const bans: Discord.GuildBan[] = [];

 let wasntThousand = false;
 while (wasntThousand === false) {
  // eslint-disable-next-line no-await-in-loop
  const fetched = await fetchBans(bans.at(-1)?.user.id);
  if (!fetched) {
   wasntThousand = true;
   return [];
  }

  if (fetched?.size !== 1000) wasntThousand = true;

  bans.push(...fetched.map((b) => b));
 }

 return bans;
};
