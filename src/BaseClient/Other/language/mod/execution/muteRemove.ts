import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.muteRemove,
 dm: (options: CT.ModOptions<CT.ModTypes.MuteRemove>) =>
  t.stp(t.JSON.mod.execution.muteRemove.dm, {
   options,
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.muteRemove.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.muteRemove.success, {
   target: t.languageFunction.getUser(target),
  }),
});
