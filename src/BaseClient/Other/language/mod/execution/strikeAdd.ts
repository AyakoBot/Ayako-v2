import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.strikeAdd,
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.strikeAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.strikeAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
