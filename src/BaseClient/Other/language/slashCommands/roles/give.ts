import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.give,
 alreadyHas: (role: Discord.Role, user: Discord.User) =>
  t.stp(t.JSON.slashCommands.roles.give.alreadyHas, {
   role: t.languageFunction.getRole(role),
   user: t.languageFunction.getUser(user),
  }),
 given: (role: Discord.Role, user: Discord.User) =>
  t.stp(t.JSON.slashCommands.roles.give.given, {
   role: t.languageFunction.getRole(role),
   user: t.languageFunction.getUser(user),
  }),
});
