import * as Discord from 'discord.js';
import * as ch from '../../../../ClientHelper.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs.tempChannelBanAdd,
 description: (
  target: Discord.User,
  executor: Discord.User,
  options: CT.ModOptions<'tempChannelBanAdd'>,
 ) =>
  t.stp(t.JSON.mod.logs.tempChannelBanAdd.description, {
   target: t.languageFunction.getUser(target),
   executor: t.languageFunction.getUser(executor),
   options: {
    channel: t.languageFunction.getChannel(options.channel),
    duration: ch.constants.standard.getTime(options.duration * 1000),
   },
  }),
});
