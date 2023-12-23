import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.user,
 desc: (user: Discord.User) =>
  t.stp(t.JSON.events.logs.user.desc, {
   user: t.languageFunction.getUser(user),
  }),
});
