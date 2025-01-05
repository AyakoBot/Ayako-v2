import type { Client, User } from 'discord.js';

export default (client: Client) => {
 const userSet = client.users.cache.set;

 client.users.cache.set = (id, user) => {
  addUserDB(user);
  return userSet(id, user);
 };
};

const addUserDB = (user: User) =>
 user.client.util.DataBase.users
  .upsert({
   where: { userid: user.id },
   create: {
    userid: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.displayAvatarURL(),
    lastfetch: Date.now(),
   },
   update: {
    avatar: user.displayAvatarURL(),
    username: user.username,
    displayName: user.displayName,
    lastfetch: Date.now(),
   },
  })
  .then();
