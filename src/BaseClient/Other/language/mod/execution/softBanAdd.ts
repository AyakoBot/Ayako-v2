import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.softBanAdd,
 dm: (options: CT.ModOptions<'softBanAdd'>) =>
  t.stp(t.JSON.mod.execution.softBanAdd.dm, {
   options,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.softBanAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.softBanAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
