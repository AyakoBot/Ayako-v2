import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.vcTempDeafenAdd,
 dm: () => t.JSON.mod.execution.vcTempDeafenAdd.dm,
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.vcTempDeafenAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.vcTempDeafenAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
