import * as Discord from 'discord.js';
import * as ch from '../../../../ClientHelper.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs.tempMuteAdd,
 description: (
  target: Discord.User,
  executor: Discord.User,
  options: CT.ModOptions<CT.ModTypes.TempMuteAdd>,
 ) =>
  t.stp(t.JSON.mod.logs.tempMuteAdd.description, {
   target: t.languageFunction.getUser(target),
   executor: t.languageFunction.getUser(executor),
   duration: ch.constants.standard.getTime(Date.now() + options.duration * 1000),
  }),
});
