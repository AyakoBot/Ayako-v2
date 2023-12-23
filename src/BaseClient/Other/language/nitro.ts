import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.nitro,
 given: (user: Discord.User, r: string, days: string | number) =>
  t.stp(t.JSON.nitro.given, {
   user,
   r,
   days,
  }),
 taken: (user: Discord.User, r: string) =>
  t.stp(t.JSON.nitro.taken, {
   user,
   r,
  }),
});
