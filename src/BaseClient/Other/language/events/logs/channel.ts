import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.channel,
 descCreateAudit: (
  user: Discord.User,
  channel: Discord.GuildChannel | Discord.AnyThreadChannel,
  type: string,
 ) =>
  t.stp(t.JSON.events.logs.channel.descCreateAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, type),
  }),
 descCreate: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
  t.stp(t.JSON.events.logs.channel.descCreate, {
   channel: t.languageFunction.getChannel(channel, type),
  }),
 descDeleteAudit: (
  user: Discord.User,
  channel: Discord.GuildChannel | Discord.AnyThreadChannel,
  type: string,
 ) =>
  t.stp(t.JSON.events.logs.channel.descDeleteAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, type),
  }),
 descDelete: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
  t.stp(t.JSON.events.logs.channel.descDelete, {
   channel: t.languageFunction.getChannel(channel, type),
  }),
 descUpdateAudit: (
  user: Discord.User,
  channel: Discord.GuildChannel | Discord.AnyThreadChannel,
  type: string,
 ) =>
  t.stp(t.JSON.events.logs.channel.descUpdateAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, type),
  }),
 descUpdate: (channel: Discord.GuildChannel | Discord.AnyThreadChannel, type: string) =>
  t.stp(t.JSON.events.logs.channel.descUpdate, {
   channel: t.languageFunction.getChannel(channel, type),
  }),
 descJoinMember: (thread: Discord.ThreadChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descJoinMember, {
   channel: t.languageFunction.getChannel(thread, channelType),
  }),
 descLeaveMember: (thread: Discord.ThreadChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descLeaveMember, {
   channel: t.languageFunction.getChannel(thread, channelType),
  }),
 descUpdateStageAudit: (channel: Discord.StageChannel, channelType: string, user: Discord.User) =>
  t.stp(t.JSON.events.logs.channel.descUpdateStageAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descUpdateStage: (channel: Discord.StageChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descUpdateStage, {
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descCreateStageAudit: (channel: Discord.StageChannel, channelType: string, user: Discord.User) =>
  t.stp(t.JSON.events.logs.channel.descCreateStageAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descCreateStage: (channel: Discord.StageChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descCreateStage, {
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descDeleteStageAudit: (channel: Discord.StageChannel, channelType: string, user: Discord.User) =>
  t.stp(t.JSON.events.logs.channel.descDeleteStageAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descDeleteStage: (channel: Discord.StageChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descDeleteStage, {
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 descPinCreateAudit: (user: Discord.User, msg: Discord.Message, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descPinCreateAudit, {
   user: t.languageFunction.getUser(user),
   msg: t.languageFunction.getMessage(msg),
   channel: t.languageFunction.getChannel(msg.channel, channelType),
  }),
 descPinCreate: (msg: Discord.Message, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descPinCreate, {
   msg: t.languageFunction.getMessage(msg),
   channel: t.languageFunction.getChannel(msg.channel, channelType),
  }),
 descPinRemoveAudit: (user: Discord.User, msg: Discord.Message, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descPinRemoveAudit, {
   user: t.languageFunction.getUser(user),
   msg: t.languageFunction.getMessage(msg),
   channel: t.languageFunction.getChannel(msg.channel, channelType),
  }),
 descPinRemove: (msg: Discord.Message, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descPinRemove, {
   msg: t.languageFunction.getMessage(msg),
   channel: t.languageFunction.getChannel(msg.channel, channelType),
  }),
 descTyping: (user: Discord.User, channel: Discord.GuildTextBasedChannel, channelType: string) =>
  t.stp(t.JSON.events.logs.channel.descTyping, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
  }),
 privacyLevel: {
  1: t.JSON.events.logs.channel.privacyLevel[1],
  2: t.JSON.events.logs.channel.privacyLevel[2],
 },
 videoQualityMode: {
  1: t.JSON.events.logs.channel.videoQualityMode[1],
  2: t.JSON.events.logs.channel.videoQualityMode[2],
 },
});
