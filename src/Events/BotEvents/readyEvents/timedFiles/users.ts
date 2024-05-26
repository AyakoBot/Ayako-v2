import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

const getRelevantUserIds = async () => {
 const art = await client.util.DataBase.art.findMany({
  where: {},
  select: { userid: true },
 });

 const credits = await client.util.DataBase.contributers.findMany({
  where: {},
  select: { userid: true },
 });

 const reviews = await client.util.DataBase.reviews.findMany({
  where: {},
  select: { userid: true },
 });

 return [
  ...new Set(
   [art.map((a) => a.userid), credits.map((c) => c.userid), reviews.map((c) => c.userid)].flat(),
  ),
 ];
};

export default async () => {
 if (client.user?.id !== process.env.mainId) return;

 const relevantUsers = await getRelevantUserIds();
 const expiredUsers = await client.util.DataBase.users.findMany({
  where: { userid: { in: relevantUsers }, lastfetch: { lt: Date.now() - 86400000 } },
  select: { userid: true },
 });

 const usersNotInDb = relevantUsers.filter((u) => !expiredUsers.find((e) => e.userid === u));

 const fetchedUsers = await Promise.all(
  [...expiredUsers.map((u) => u.userid), ...usersNotInDb].map((u) => client.util.getUser(u)),
 );

 fetchedUsers
  .filter((u): u is Discord.User => !!u)
  .forEach((u) => {
   client.util.DataBase.users
    .upsert({
     where: { userid: u.id },
     update: { lastfetch: Date.now(), avatar: u.displayAvatarURL(), username: u.username },
     create: {
      lastfetch: Date.now(),
      avatar: u.displayAvatarURL(),
      username: u.username,
      userid: u.id,
     },
    })
    .then();
  });
};
