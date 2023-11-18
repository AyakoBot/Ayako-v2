import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.voiceState,
 descCreate: (user: Discord.User, channel: Discord.GuildChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.voiceState.descCreate, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descUpdateChannel: (
  user: Discord.User,
  channel: Discord.GuildChannel,
  channelType: string,
  oldChannel: Discord.GuildChannel | undefined,
  oldChannelType: string | undefined,
 ) =>
  t.stp(t.JSON.events.logs.voiceState.descUpdateChannel, {
   user: t.languageFunction.getUser(user),
   newChannel: t.languageFunction.getChannel(channel, channelType),
   oldChannel: t.languageFunction.getChannel(oldChannel, oldChannelType),
  }),
 descUpdate: (user: Discord.User, channel: Discord.VoiceBasedChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.voiceState.descUpdate, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descDelete: (user: Discord.User, channel: Discord.GuildChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.voiceState.descDelete, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
});
