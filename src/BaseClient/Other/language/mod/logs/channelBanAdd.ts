import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs.channelBanAdd,
 description: (
  target: Discord.User,
  executor: Discord.User,
  options: CT.ModOptions<'channelBanAdd'>,
 ) =>
  t.stp(t.JSON.mod.logs.channelBanAdd.description, {
   target: t.languageFunction.getUser(target),
   executor: t.languageFunction.getUser(executor),
   options: t.languageFunction.getChannel(options.channel),
  }),
});
