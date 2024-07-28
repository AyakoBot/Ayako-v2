import { Guild } from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

export default async () => {
 if (client.user?.id !== process.env.mainId) return;

 const [oldGuilds] = await client.util.DataBase.$transaction([
  client.util.DataBase.guilds.findMany({
   where: { fetchat: { lt: Date.now() - 6000000 } },
  }),
  client.util.DataBase.guilds.deleteMany({ where: { fetchat: { lt: Date.now() - 6000000 } } }),
 ]);

 const guildIds = oldGuilds.map((g) => g.guildid);
 const guildsToFetch = client.guilds.cache.filter((g) => guildIds.includes(g.id)).map((g) => g);
 const guilds = [
  ...guildsToFetch.filter((g) => g.memberCount < 10000),
  ...(await Promise.all(
   guildsToFetch
    .filter((g) => g.memberCount < 10000)
    .map((g) => client.guilds.fetch({ guild: g.id, withCounts: true }) as Promise<Guild>),
  )),
 ];

 guilds.forEach((g) => {
  client.util.DataBase.guilds
   .create({
    data: {
     fetchat: Date.now(),
     guildid: g.id,
     name: g.name,
     banner: g.bannerURL(),
     icon: g.iconURL(),
     invite: g.vanityURLCode,
     membercount: g.memberCount,
     presencecount: g.memberCount,
    },
   })
   .then();
 });
};
