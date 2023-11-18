import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs.roleRemove,
 description: (
  target: Discord.User,
  executor: Discord.User,
  options: CT.ModOptions<'roleRemove'>,
 ) =>
  t.stp(t.JSON.mod.logs.roleRemove.description, {
   options,
   wasWere: options.roles.length > 1 ? t.JSON.mod.logs.roleAdd.were : t.JSON.mod.logs.roleAdd.was,
   target: t.languageFunction.getUser(target),
   executor: t.languageFunction.getUser(executor),
  }),
});
