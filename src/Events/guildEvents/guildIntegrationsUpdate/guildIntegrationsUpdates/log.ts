import type * as Discord from 'discord.js';
import type CT from '../../../../Typings/CustomTypings.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (oldIntegration: Discord.Integration, integration: Discord.Integration) => {
 if (
  JSON.stringify(oldIntegration.scopes.sort((a, b) => a.localeCompare(b))) ===
  JSON.stringify(integration.scopes.sort((a, b) => a.localeCompare(b)))
 ) {
  return;
 }

 const channels = await ch.getLogChannels('guildevents', integration.guild);
 if (!channels) return;

 const language = await ch.getLanguage(integration.guild.id);
 const lan = language.events.logs.integration;
 const con = ch.constants.events.logs.guild;
 const audit = await ch.getAudit(integration.guild, 81, integration.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.BotUpdate,
   name: lan.nameUpdate,
  },
  description: auditUser
   ? lan.descUpdateAudit(auditUser, integration)
   : lan.descUpdate(integration),
  fields: [],
  color: ch.constants.colors.loading,
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  ch.mergeLogging(before, after, type, embed, language, name);

 if (oldIntegration?.enabled !== integration?.enabled) {
  merge(oldIntegration.enabled, integration.enabled, 'boolean', language.t.Enabled);
 }

 if (oldIntegration.syncing !== integration.syncing) {
  merge(oldIntegration.syncing, integration.syncing, 'boolean', lan.syncing);
 }

 if (oldIntegration.role !== integration.role && integration.role && oldIntegration.role) {
  merge(
   language.languageFunction.getRole(oldIntegration.role),
   language.languageFunction.getRole(integration.role),
   'string',
   language.t.Role,
  );
 }

 if (oldIntegration.enableEmoticons !== integration.enableEmoticons) {
  merge(
   oldIntegration.enableEmoticons,
   integration.enableEmoticons,
   'boolean',
   lan.enableEmoticons,
  );
 }

 if (oldIntegration.expireBehavior !== integration.expireBehavior) {
  merge(
   oldIntegration.expireBehavior
    ? lan.expireBehavior[oldIntegration.expireBehavior]
    : language.t.None,
   integration.expireBehavior ? lan.expireBehavior[integration.expireBehavior] : language.t.None,
   'string',
   lan.expireBehaviorName,
  );
 }

 if (oldIntegration.expireGracePeriod !== integration.expireGracePeriod) {
  merge(
   oldIntegration.expireGracePeriod
    ? ch.moment(oldIntegration.expireGracePeriod, language)
    : language.t.None,
   integration.expireGracePeriod
    ? ch.moment(integration.expireGracePeriod, language)
    : language.t.None,
   'string',
   lan.expireGracePeriod,
  );
 }

 if (oldIntegration.syncedAt !== integration.syncedAt) {
  merge(
   oldIntegration.syncedAt
    ? ch.constants.standard.getTime(oldIntegration.syncedAt.getTime())
    : language.t.None,
   integration.syncedAt
    ? ch.constants.standard.getTime(integration.syncedAt.getTime())
    : language.t.None,
   'string',
   lan.syncedAt,
  );
 }

 if (oldIntegration.revoked !== integration.revoked) {
  merge(oldIntegration.revoked, integration.revoked, 'boolean', lan.revoked);
 }

 if (oldIntegration.type !== integration.type) {
  merge(oldIntegration.type, integration.type, 'string', language.t.Type);
 }

 if (oldIntegration.name !== integration.name) {
  merge(oldIntegration.name, integration.name, 'string', language.t.name);
 }

 if (JSON.stringify(oldIntegration.account) !== JSON.stringify(integration.account)) {
  merge(
   lan.getAccount(oldIntegration.account),
   lan.getAccount(integration.account),
   'string',
   lan.account,
  );
 }

 if (!embed.fields?.length) return;

 ch.send({ id: channels, guildId: integration.guild.id }, { embeds: [embed] }, 10000);
};
