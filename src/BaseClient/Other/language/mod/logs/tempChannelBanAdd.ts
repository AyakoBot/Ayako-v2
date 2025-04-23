import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs.tempChannelBanAdd,
 description: (
  target: Discord.User,
  executor: Discord.User,
  options: CT.ModOptions<CT.ModTypes.TempChannelBanAdd>,
 ) =>
  t.stp(t.JSON.mod.logs.tempChannelBanAdd.description, {
   target: t.languageFunction.getUser(target),
   executor: t.languageFunction.getUser(executor),
   channel: t.languageFunction.getChannel(options.channel),
   time: t.util.constants.standard.getTime(Date.now() + options.duration * 1000),
  }),
});
