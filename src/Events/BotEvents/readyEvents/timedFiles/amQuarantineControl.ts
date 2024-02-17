import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default () => {
 const guilds = [
  client.guilds.cache.get('298954459172700181'),
  client.guilds.cache.get('266632338883084290'),
 ];

 guilds.forEach((guild) => {
  if (!guild) return;

  const members = guild.members.cache.filter((m) => m.user.flags?.has(Discord.UserFlags.Spammer));

  members.forEach((m) => {
   client.util.mod(
    undefined,
    CT.ModTypes.BanAdd,
    {
     dbOnly: false,
     deleteMessageSeconds: 0,
     executor: guild.client.user,
     guild,
     reason: 'Suspected Spammer',
     target: m.user,
     skipChecks: false,
    },
    undefined,
   );
  });
 });
};
