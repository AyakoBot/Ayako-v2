import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';
import * as ch from '../../../../ClientHelper.js';

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
   options: {
    channel: t.languageFunction.getChannel(options.channel),
    duration: ch.constants.standard.getTime(Date.now() + options.duration * 1000),
   },
  }),
});
