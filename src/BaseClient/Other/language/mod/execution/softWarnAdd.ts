import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.softWarnAdd,
 dm: () => t.JSON.mod.execution.softWarnAdd.dm,
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.softWarnAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.softWarnAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
