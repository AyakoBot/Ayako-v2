import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.banAdd,
 dm: (options: CT.ModOptions<'banAdd'>) =>
  t.stp(t.JSON.mod.execution.banAdd.dm, {
   options,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.banAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.banAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
