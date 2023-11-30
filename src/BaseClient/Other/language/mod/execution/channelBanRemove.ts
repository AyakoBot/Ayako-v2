import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.channelBanRemove,
 dm: (options: CT.ModOptions<'channelBanRemove'>) =>
  t.stp(t.JSON.mod.execution.channelBanRemove.dm, {
   channel: t.languageFunction.getChannel(options.channel),
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.channelBanRemove.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.channelBanRemove.success, {
   target: t.languageFunction.getUser(target),
  }),
});
