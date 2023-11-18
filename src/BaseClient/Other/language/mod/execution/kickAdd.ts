import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.kickAdd,
 dm: (options: CT.ModOptions<'kickAdd'>) =>
  t.stp(t.JSON.mod.execution.kickAdd.dm, {
   options,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.kickAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.kickAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
