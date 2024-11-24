import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.vcDeafenRemove,
 dm: () => t.JSON.mod.execution.vcDeafenRemove.dm,
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.vcDeafenRemove.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.vcDeafenRemove.success, {
   target: t.languageFunction.getUser(target),
  }),
});
