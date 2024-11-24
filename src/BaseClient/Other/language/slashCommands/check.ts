import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.check,
 name: t.stp(t.JSON.slashCommands.check.name, { t }),
 desc: (
  user: Discord.User,
  {
   w,
   m,
   cb,
   b,
   r,
   vcD,
   vcM,
  }: { w: number; m: number; cb: number; b: number; r: number; vcD: number; vcM: number },
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
   w: t.util.util.makeBold(String(w)),
   m: t.util.util.makeBold(String(m)),
   cb: t.util.util.makeBold(String(cb)),
   b: t.util.util.makeBold(String(b)),
   r: t.util.util.makeBold(String(r)),
   vcD: t.util.util.makeBold(String(vcD)),
   vcM: t.util.util.makeBold(String(vcM)),
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
