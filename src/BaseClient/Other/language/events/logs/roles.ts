import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.role,
 descCreateAudit: (user: Discord.User, role: Discord.Role) =>
  t.stp(t.JSON.events.logs.role.descCreateAudit, {
   role: t.languageFunction.getRole(role),
   user: t.languageFunction.getUser(user),
  }),
 descCreate: (role: Discord.Role) =>
  t.stp(t.JSON.events.logs.role.descCreate, {
   role: t.languageFunction.getRole(role),
  }),
 descDeleteAudit: (user: Discord.User, role: Discord.Role) =>
  t.stp(t.JSON.events.logs.role.descCreateAudit, {
   role: t.languageFunction.getRole(role),
   user: t.languageFunction.getUser(user),
  }),
 descDelete: (role: Discord.Role) =>
  t.stp(t.JSON.events.logs.role.descCreate, {
   role: t.languageFunction.getRole(role),
  }),
 descUpdateAudit: (role: Discord.Role, user: Discord.User) =>
  t.stp(t.JSON.events.logs.role.descCreateAudit, {
   role: t.languageFunction.getRole(role),
   user: t.languageFunction.getUser(user),
  }),
 descUpdate: (role: Discord.Role) =>
  t.stp(t.JSON.events.logs.role.descCreate, {
   role: t.languageFunction.getRole(role),
  }),
});
