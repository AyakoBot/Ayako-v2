import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.moderation.unafk,
 notAfk: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.moderation.unafk.notAfk, { user: t.languageFunction.getUser(user) }),
 unAfk: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.moderation.unafk.unAfk, { user: t.languageFunction.getUser(user) }),
});
