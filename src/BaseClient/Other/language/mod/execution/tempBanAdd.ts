import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.tempBanAdd,
 dm: (options: CT.ModOptions<CT.ModTypes.TempBanAdd>) =>
  t.stp(t.JSON.mod.execution.tempBanAdd.dm, {
   guild: t.languageFunction.getGuild(options.guild),
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.tempBanAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.tempBanAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
