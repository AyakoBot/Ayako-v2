import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.channelBanAdd,
 dm: (options: CT.ModOptions<'channelBanAdd'>) =>
  t.stp(t.JSON.mod.execution.channelBanAdd.dm, {
   options,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.channelBanAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.channelBanAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
