import * as Discord from 'discord.js';
import * as ch from '../../../../ClientHelper.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

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
    : t.JSON.None,
  }),
 botInfo: (res: CT.TopGGResponse<true>) =>
  t.stp(t.JSON.slashCommands.info.user.botInfo, {
   serverCount: res.server_count ?? t.JSON.Unknown,
   tags: res.tags?.map((tag) => `\`${tag}\``).join(', ') ?? t.JSON.None,
   website: res.website ?? t.JSON.None,
   support: res.support ? `https://discord.gg/${res.support}` : t.JSON.None,
   github: res.github ?? t.JSON.None,
   res,
  }),
});
