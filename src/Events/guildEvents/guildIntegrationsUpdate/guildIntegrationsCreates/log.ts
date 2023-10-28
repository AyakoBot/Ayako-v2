import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (integration: Discord.Integration) => {
 const channels = await ch.getLogChannels('guildevents', integration.guild);
 if (!channels) return;

 const language = await ch.getLanguage(integration.guild.id);
 const lan = language.events.logs.integration;
 const con = ch.constants.events.logs.guild;
 const audit = await ch.getAudit(integration.guild, 80, integration.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.BotCreate,
   name: lan.nameCreate,
  },
  description: auditUser
   ? lan.descCreateAudit(integration, auditUser)
   : lan.descCreate(integration),
  fields: [],
  color: ch.constants.colors.success,
  timestamp: new Date().toISOString(),
 };

 const flagsText = [
  integration.enabled ? language.Enabled : null,
  integration.syncing ? lan.syncing : null,
  integration.enableEmoticons ? lan.enableEmoticons : null,
  integration.revoked ? lan.revoked : null,
 ]
  .filter((f): f is string => !!f)
  .map((f) => `\`${f}\``)
  .join(', ');

 if (flagsText) {
  embed.fields?.push({
   name: language.Flags,
   value: flagsText,
   inline: true,
  });
 }

 if (integration.user) {
  embed.fields?.push({
   name: language.User,
   value: language.languageFunction.getUser(integration.user),
  });
 }

 if (integration.role) {
  embed.fields?.push({
   name: language.Role,
   value: language.languageFunction.getRole(integration.role),
  });
 }

 if (typeof integration.expireBehavior === 'number') {
  embed.fields?.push({
   name: lan.expireBehaviorName,
   value: lan.expireBehavior[integration.expireBehavior],
  });
 }

 if (integration.expireGracePeriod) {
  embed.fields?.push({
   name: lan.expireGracePeriod,
   value: ch.moment(integration.expireGracePeriod, language),
  });
 }

 if (integration.expireGracePeriod) {
  embed.fields?.push({
   name: lan.expireGracePeriod,
   value: ch.moment(integration.expireGracePeriod, language),
  });
 }

 if (integration.syncedAt) {
  embed.fields?.push({
   name: lan.syncedAt,
   value: ch.constants.standard.getTime(integration.syncedAt.getTime()),
  });
 }

 if (integration.subscriberCount) {
  embed.fields?.push({
   name: lan.subscriberCount,
   value: String(integration.subscriberCount),
  });
 }

 if (integration.application) {
  embed.fields?.push({
   name: `${language.Application} / ${language.Bot}`,
   value: `${language.languageFunction.getApplication(integration.application)}${
    integration.application.bot
     ? `\n${language.languageFunction.getUser(integration.application.bot)}`
     : ''
   }`,
  });
 }

 embed.fields?.push(
  {
   name: language.Type,
   value: integration.type,
  },
  {
   name: language.name,
   value: integration.name,
  },
  {
   name: language.Scopes,
   value: integration.scopes
    .map((s) => `\`${language.scopes[s as keyof typeof language.scopes]}\``)
    .join(', '),
  },
  {
   name: lan.account,
   value: lan.getAccount(integration.account),
  },
 );

 ch.send({ id: channels, guildId: integration.guild.id }, { embeds: [embed] }, 10000);
};
