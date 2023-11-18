import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.tempMuteAdd,
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.tempMuteAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.tempMuteAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
