import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs.vcDeafenAdd,
 description: (target: Discord.User, executor: Discord.User) =>
  t.stp(t.JSON.mod.logs.vcDeafenAdd.description, {
   target: t.languageFunction.getUser(target),
   executor: t.languageFunction.getUser(executor),
  }),
});
