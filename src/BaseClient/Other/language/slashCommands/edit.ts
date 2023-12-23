import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import * as ch from '../../../ClientHelper.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.edit,
 desc: (user: Discord.User, target: Discord.User, punId: string) =>
  t.stp(t.JSON.slashCommands.edit.desc, {
   punId: ch.util.makeInlineCode(punId),
   target: t.languageFunction.getUser(target),
   user: t.languageFunction.getUser(user),
  }),
});
