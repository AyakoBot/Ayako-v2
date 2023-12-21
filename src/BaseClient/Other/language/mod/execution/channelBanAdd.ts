import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.execution.channelBanAdd,
 dm: (options: CT.ModOptions<CT.ModTypes.ChannelBanAdd>) =>
  t.stp(t.JSON.mod.execution.channelBanAdd.dm, {
   channel: t.languageFunction.getChannel(options.channel),
  }),
 alreadyApplied: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.channelBanAdd.alreadyApplied, {
   target: t.languageFunction.getUser(target),
  }),
 success: (target: Discord.User) =>
  t.stp(t.JSON.mod.execution.channelBanAdd.success, {
   target: t.languageFunction.getUser(target),
  }),
});
