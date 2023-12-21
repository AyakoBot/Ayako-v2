import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.tempChannelBanAdd,
 dm: (options: CT.ModOptions<CT.ModTypes.TempChannelBanAdd>) =>
  t.stp(t.JSON.mod.execution.tempChannelBanAdd.dm, {
   channel: t.languageFunction.getChannel(options.channel),
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
