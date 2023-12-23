import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.delete,
 areYouSure: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.roles.delete.areYouSure, {
   role: t.languageFunction.getRole(role),
  }),
 deleted: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.roles.delete.deleted, {
   role: t.languageFunction.getRole(role),
  }),
});
