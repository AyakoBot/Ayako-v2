import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.webhook,
 descCreateAudit: (
  webhook: Discord.Webhook,
  webhookType: string,
  user: Discord.User,
  channel: Discord.GuildTextBasedChannel,
  channelType: string,
 ) =>
  t.stp(t.JSON.events.logs.webhook.descCreateAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
   webhook: t.languageFunction.getWebhook(webhook, webhookType),
  }),
 descCreate: (
  webhook: Discord.Webhook,
  webhookType: string,
  channel: Discord.GuildTextBasedChannel,
  channelType: string,
 ) =>
  t.stp(t.JSON.events.logs.webhook.descCreate, {
   channel: t.languageFunction.getChannel(channel, channelType),
   webhook: t.languageFunction.getWebhook(webhook, webhookType),
  }),
 descDeleteAudit: (
  webhook: Discord.Webhook,
  webhookType: string,
  user: Discord.User,
  channel: Discord.GuildTextBasedChannel,
  channelType: string,
 ) =>
  t.stp(t.JSON.events.logs.webhook.descDeleteAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
   webhook: t.languageFunction.getWebhook(webhook, webhookType),
  }),
 descDelete: (
  webhook: Discord.Webhook,
  webhookType: string,
  channel: Discord.GuildTextBasedChannel,
  channelType: string,
 ) =>
  t.stp(t.JSON.events.logs.webhook.descDelete, {
   channel: t.languageFunction.getChannel(channel, channelType),
   webhook: t.languageFunction.getWebhook(webhook, webhookType),
  }),
 descUpdateAudit: (
  webhook: Discord.Webhook,
  webhookType: string,
  user: Discord.User,
  channel: Discord.GuildTextBasedChannel,
  channelType: string,
 ) =>
  t.stp(t.JSON.events.logs.webhook.descUpdateAudit, {
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, channelType),
   webhook: t.languageFunction.getWebhook(webhook, webhookType),
  }),
 descUpdate: (
  webhook: Discord.Webhook,
  webhookType: string,
  channel: Discord.GuildTextBasedChannel,
  channelType: string,
 ) =>
  t.stp(t.JSON.events.logs.webhook.descUpdate, {
   channel: t.languageFunction.getChannel(channel, channelType),
   webhook: t.languageFunction.getWebhook(webhook, webhookType),
  }),
 webhookTypes: {
  1: t.JSON.events.logs.webhook.webhookTypes[1],
  2: t.JSON.events.logs.webhook.webhookTypes[2],
  3: t.JSON.events.logs.webhook.webhookTypes[3],
 },
});
