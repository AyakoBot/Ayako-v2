import { User } from 'discord.js';

export default (args: unknown[]) => {
 args.forEach((arg) => {
  if (!arg) return;
  if (typeof arg !== 'object') return;

  if (arg instanceof User) {
   handleUser(arg);
   return;
  }

  Object.values(arg).forEach((maybeUser) => {
   if (!(maybeUser instanceof User)) return;
   handleUser(maybeUser);
  });
 });
};

export const handleUser = (user: User) => {
 if (!('client' in user)) return;
 if (!(user instanceof User)) return;

 const lastFetch = user.client.util.cache.latelySavedUsers.get(user.id);
 if (lastFetch && lastFetch > Date.now() - 86400000) return;

 user.client.util.cache.latelySavedUsers.set(user.id, Date.now());
 user.client.util.DataBase.users
  .upsert({
   where: { userid: user.id },
   create: {
    userid: user.id,
    username: user.username,
    avatar: user.displayAvatarURL(),
    lastfetch: Date.now(),
   },
   update: {
    avatar: user.displayAvatarURL(),
    username: user.username,
    lastfetch: Date.now(),
   },
  })
  .then();
};
