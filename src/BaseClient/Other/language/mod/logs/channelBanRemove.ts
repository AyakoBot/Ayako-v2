import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs.channelBanRemove,
 description: (
  target: Discord.User,
  executor: Discord.User,
  options: CT.ModOptions<'channelBanRemove'>,
 ) =>
  t.stp(t.JSON.mod.logs.channelBanRemove.description, {
   target: t.languageFunction.getUser(target),
   executor: t.languageFunction.getUser(executor),
   channel: t.languageFunction.getChannel(options.channel),
  }),
});
