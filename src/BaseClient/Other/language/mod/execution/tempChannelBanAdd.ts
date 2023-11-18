import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.tempChannelBanAdd,
 dm: (options: CT.ModOptions<'tempChannelBanAdd'>) =>
  t.stp(t.JSON.mod.execution.tempChannelBanAdd.dm, {
   options,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.tempChannelBanAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.tempChannelBanAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
