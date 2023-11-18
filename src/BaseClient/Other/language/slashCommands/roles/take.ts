import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.take,
 doesntHave: (role: Discord.Role, user: Discord.User) =>
  t.stp(t.JSON.slashCommands.roles.take.doesntHave, {
   role: t.languageFunction.getRole(role),
   user: t.languageFunction.getUser(user),
  }),
 taken: (role: Discord.Role, user: Discord.User) =>
  t.stp(t.JSON.slashCommands.roles.take.taken, {
   role: t.languageFunction.getRole(role),
   user: t.languageFunction.getUser(user),
  }),
});
