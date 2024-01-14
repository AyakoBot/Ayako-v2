import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.unafk,
 dm: () => t.JSON.mod.execution.unafk.dm,
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.unafk.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.unafk.success, {
   target: t.languageFunction.getUser(target),
  }),
});
