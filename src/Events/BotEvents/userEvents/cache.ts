import type * as Discord from 'discord.js';

export default async (user: Discord.User) => {
 user.client.util.DataBase.users
  .update({
   where: { userid: user.id },
   data: { username: user.username, avatar: user.displayAvatarURL() ?? '', lastfetch: Date.now() },
  })
  .then();
};
