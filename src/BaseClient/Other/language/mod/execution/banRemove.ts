import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.banRemove,
 dm: (options: CT.ModOptions<'banRemove'>) =>
  t.stp(t.JSON.mod.execution.banRemove.dm, {
   options,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.banRemove.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.banRemove.success, {
   target: t.languageFunction.getUser(target),
  }),
});
