import type * as Discord from 'discord.js';

export default async (oldUser: Discord.User, user: Discord.User) => {
 const guilds = user.client.guilds.cache.filter((g) => g.members.cache.has(user.id));
 if (!guilds.size) return;

 guilds.forEach((g) =>
  user.client.util.importCache.Events.BotEvents.userEvents.log.file.default(oldUser, user, g),
 );
};
