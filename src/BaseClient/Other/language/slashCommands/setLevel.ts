import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.setLevel,
 descUser: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.setLevel.descUser, { user: t.languageFunction.getUser(user) }),
 descFinUser: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.setLevel.descFinUser, { user: t.languageFunction.getUser(user) }),
 descRole: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.setLevel.descRole, { user: t.languageFunction.getRole(role) }),
 descFinRole: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.setLevel.descFinRole, { user: t.languageFunction.getRole(role) }),
});
