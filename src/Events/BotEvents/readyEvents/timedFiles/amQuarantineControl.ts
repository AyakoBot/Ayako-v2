import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default () =>
 [
  '298954459172700181',
  '266632338883084290',
  '672546390915940405',
  '108176345204264960',
  '366219406776336385',
  '637683844988010546',
  '740345435520237638',
 ]
  .map((g) => client.guilds.cache.get(g))
  .forEach(async (guild) => {
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
