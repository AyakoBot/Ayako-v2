import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';
import * as ch from '../../../../ClientHelper.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.user,
 authorUser: t.stp(t.JSON.slashCommands.info.user.authorUser, { t }),
 authorBot: t.stp(t.JSON.slashCommands.info.user.authorBot, { t }),
 memberAuthorUser: t.stp(t.JSON.slashCommands.info.user.memberAuthorUser, { t }),
 memberAuthorBot: t.stp(t.JSON.slashCommands.info.user.memberAuthorBot, { t }),
 userInfo: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.info.user.userInfo, {
   user,
   conUser: ch.constants.standard.user(user),
   accentColor: user.accentColor
    ? `\`${user.accentColor}\`/\`${user.hexAccentColor}\``
    : t.JSON.t.None,
  }),
 botInfo: (res: CT.TopGGResponse<true>) =>
  t.stp(t.JSON.slashCommands.info.user.botInfo, {
   serverCount: res.server_count ?? t.JSON.t.Unknown,
   tags: res.tags?.map((tag) => `\`${tag}\``).join(', ') ?? t.JSON.t.None,
   website: res.website ?? t.JSON.t.None,
   support: res.support ? `https://discord.gg/${res.support}` : t.JSON.t.None,
   github: res.github ?? t.JSON.t.None,
   res,
  }),
});
