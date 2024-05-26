import client from '../../../../BaseClient/Bot/Client.js';

export default async () => {
 if (client.user?.id !== process.env.mainId) return;

 await client.util.DataBase.guilds.deleteMany({ where: { fetchat: { lt: Date.now() - 60000 } } });

 client.guilds.cache.forEach((g) => {
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
    },
   })
   .then();
 });
};
