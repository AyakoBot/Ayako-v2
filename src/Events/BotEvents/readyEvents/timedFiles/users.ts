import { users } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';

const getRelevancy = async (user: users) => {
 const isInReviews = await client.util.DataBase.reviews.findUnique({
  where: { userid: user.userid },
 });
 const isInCredits = await client.util.DataBase.contributers.findUnique({
  where: { userid: user.userid },
 });
 const isInArt = await client.util.DataBase.art.findFirst({
  where: { userid: user.userid },
 });

 return [!!isInReviews, !!isInCredits, !!isInArt].includes(true);
};

export default async () => {
 const expiredUsers = await client.util.DataBase.users.findMany({
  where: { lastfetch: { lt: Date.now() - 86400000 } },
 });

 const relevancy = await Promise.all(expiredUsers.map((u) => getRelevancy(u)));
 const relevantUsers = expiredUsers.filter((_, i) => relevancy[i]);
 const fetchedUsers = await Promise.all(relevantUsers.map((u) => client.util.getUser(u.userid)));

 fetchedUsers
  .filter((u): u is Discord.User => !!u)
  .forEach((u) => {
   client.util.DataBase.users
    .update({
     where: { userid: u.id },
     data: { lastfetch: Date.now(), avatar: u?.displayAvatarURL(), username: u?.username },
    })
    .then();
  });
};
