import * as Discord from 'discord.js';
import * as ch from '../../../ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.resetLevels,
 areYouSure: (time: string) => t.stp(t.JSON.slashCommands.resetLevels.areYouSure, { t: time }),
 confirmUser: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.resetLevels.confirmUser, { user: t.languageFunction.getUser(user) }),
 confirmRole: (role: Discord.Role, amount: number) =>
  t.stp(t.JSON.slashCommands.resetLevels.confirmRole, {
   role: t.languageFunction.getRole(role),
   amount: ch.splitByThousand(amount),
  }),
 user: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.resetLevels.user, { user: t.languageFunction.getUser(user) }),
 role: (role: Discord.Role, amount: number) =>
  t.stp(t.JSON.slashCommands.resetLevels.role, {
   role: t.languageFunction.getRole(role),
   amount: ch.splitByThousand(amount),
  }),
});
