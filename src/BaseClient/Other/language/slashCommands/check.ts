import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import * as ch from '../../../ClientHelper.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.check,
 name: t.stp(t.JSON.slashCommands.check.name, { t }),
 desc: (
  user: Discord.User,
  { w, m, cb, b, r }: { w: number; m: number; cb: number; b: number; r: number },
  {
   isBanned,
   isMuted,
   isChannelBanned,
  }: { isBanned: boolean; isMuted: boolean; isChannelBanned: boolean },
  {
   banEmote,
   muteEmote,
   channelbanEmote,
  }: { banEmote: string; muteEmote: string; channelbanEmote: string },
 ) =>
  t.stp(t.JSON.slashCommands.check.desc, {
   user: t.languageFunction.getUser(user),
   w: ch.util.makeBold(String(w)),
   m: ch.util.makeBold(String(m)),
   cb: ch.util.makeBold(String(cb)),
   b: ch.util.makeBold(String(b)),
   r: ch.util.makeBold(String(r)),
   isBanned: isBanned
    ? `${banEmote} ${t.JSON.slashCommands.check.status.banned}`
    : `${banEmote} ${t.JSON.slashCommands.check.status.notBanned}`,
   isMuted: isMuted
    ? `${muteEmote} ${t.JSON.slashCommands.check.status.muted}`
    : `${muteEmote} ${t.JSON.slashCommands.check.status.notMuted}`,
   isChannelBanned: isChannelBanned
    ? `${channelbanEmote} ${t.JSON.slashCommands.check.status.channelBanned}`
    : `${channelbanEmote} ${t.JSON.slashCommands.check.status.notChannelBanned}`,
  }),
});
