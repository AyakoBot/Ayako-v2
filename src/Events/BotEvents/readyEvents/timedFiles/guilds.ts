import { Guild } from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async () => {
 if (client.user?.id !== process.env.mainId) return;

 const [upToDateGuilds] = await client.util.DataBase.$transaction([
  client.util.DataBase.guilds.findMany({
   where: {
    fetchat: { gte: Date.now() - 6000000 },
    guildid: { in: client.guilds.cache.map((g) => g.id) },
   },
  }),
  client.util.DataBase.guilds.deleteMany({ where: { fetchat: { lt: Date.now() - 6000000 } } }),
 ]);

 const guildsToFetch = client.guilds.cache
  .filter((g) => !upToDateGuilds.find((g2) => g2.guildid === g.id))
  .map((g) => g);

 const guildsNoCounts = guildsToFetch.filter((g) => g.memberCount <= 10000);
 const guildsCounts = await Promise.all(
  guildsToFetch
   .filter((g) => g.memberCount > 10000)
   .map((g) => client.util.request.guilds.get(g, g.id, { with_counts: true }) as Promise<Guild>),
 );

 const guilds = [...guildsNoCounts, ...guildsCounts];

 client.util.DataBase.$transaction(
  guilds.map((g) =>
   client.util.DataBase.guilds.create({
    data: {
     fetchat: Date.now(),
     guildid: g.id,
     name: g.name,
     banner: g.bannerURL(),
     icon: g.iconURL(),
     invite: g.vanityURLCode,
     membercount: g.memberCount,
     presencecount: g.approximatePresenceCount ?? Math.round(g.memberCount / 6),
     features: g.features,
    },
   }),
  ),
 ).then();
};
