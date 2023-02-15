import type * as Discord from 'discord.js';
import type CT from '../../../../Typings/CustomTypings';
import client from '../../../../BaseClient/Client.js';

export default async (oldIntegration: Discord.Integration, integration: Discord.Integration) => {
  const channels = await client.ch.getLogChannels('guildevents', integration.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(integration.guild.id);
  const lan = language.events.logs.integration;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(integration.guild, 81, integration.id);
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
    color: client.customConstants.colors.loading,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  if (oldIntegration?.enabled !== integration?.enabled) {
    merge(oldIntegration.enabled, integration.enabled, 'boolean', language.Enabled);
  }

  if (oldIntegration.syncing !== integration.syncing) {
    merge(oldIntegration.syncing, integration.syncing, 'boolean', lan.syncing);
  }

  if (oldIntegration.role !== integration.role && integration.role && oldIntegration.role) {
    merge(
      language.languageFunction.getRole(oldIntegration.role),
      language.languageFunction.getRole(integration.role),
      'string',
      language.Role,
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
        : language.none,
      integration.expireBehavior ? lan.expireBehavior[integration.expireBehavior] : language.none,
      'string',
      lan.expireBehaviorName,
    );
  }

  if (oldIntegration.expireGracePeriod !== integration.expireGracePeriod) {
    merge(
      oldIntegration.expireGracePeriod
        ? client.ch.moment(oldIntegration.expireGracePeriod, language)
        : language.none,
      integration.expireGracePeriod
        ? client.ch.moment(integration.expireGracePeriod, language)
        : language.none,
      'string',
      lan.expireGracePeriod,
    );
  }

  if (oldIntegration.syncedAt !== integration.syncedAt) {
    merge(
      oldIntegration.syncedAt
        ? client.customConstants.standard.getTime(oldIntegration.syncedAt.getTime())
        : language.none,
      integration.syncedAt
        ? client.customConstants.standard.getTime(integration.syncedAt.getTime())
        : language.none,
      'string',
      lan.syncedAt,
    );
  }

  if (oldIntegration.revoked !== integration.revoked) {
    merge(oldIntegration.revoked, integration.revoked, 'boolean', lan.revoked);
  }

  if (oldIntegration.type !== integration.type) {
    merge(oldIntegration.type, integration.type, 'string', language.Type);
  }

  if (oldIntegration.name !== integration.name) {
    merge(oldIntegration.name, integration.name, 'string', language.name);
  }

  if (JSON.stringify(oldIntegration.account) !== JSON.stringify(integration.account)) {
    merge(
      lan.getAccount(oldIntegration.account),
      lan.getAccount(integration.account),
      'string',
      lan.account,
    );
  }

  if (!embed.fields?.length) {
    console.log(oldIntegration, integration);
    return;
  }

  client.ch.send(
    { id: channels, guildId: integration.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
