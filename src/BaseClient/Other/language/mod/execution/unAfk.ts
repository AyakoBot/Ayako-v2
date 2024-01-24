import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.unAfk,
 dm: () => t.JSON.mod.execution.unAfk.dm,
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.unAfk.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.unAfk.success, {
   target: t.languageFunction.getUser(target),
  }),
});
