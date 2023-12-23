import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.roleRemove,
 dm: (options: CT.ModOptions<CT.ModTypes.RoleRemove>) =>
  t.stp(t.JSON.mod.execution.roleRemove.dm, {
   roles: options.roles.join(', '),
   haveHas:
    options.roles.length > 1 ? t.JSON.mod.execution.roleAdd.have : t.JSON.mod.execution.roleAdd.has,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.roleRemove.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User, options: CT.ModOptions<CT.ModTypes.RoleRemove>) =>
  t.stp(t.JSON.mod.execution.roleRemove.success, {
   roles: options.roles.join(', '),
   wasWere:
    options.roles.length > 1 ? t.JSON.mod.execution.roleAdd.were : t.JSON.mod.execution.roleAdd.was,
   target: t.languageFunction.getUser(target),
  }),
});
