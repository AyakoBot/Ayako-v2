import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (oldIntegration: DDeno.Integration, integration: DDeno.Integration) => {
  const channels = await client.ch.getLogChannels('guildevents', integration);
  if (!channels) return;

  const guild = await client.cache.guilds.get(integration.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(integration.guildId);
  const lan = language.events.logs.integration;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 81, integration.id);
  const auditUser = audit && audit.userId ? await client.cache.users.get(audit.userId) : undefined;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.BotDelete,
      name: lan.nameDelete,
    },
    description: auditUser
      ? lan.descUpdateAudit(auditUser, integration)
      : lan.descUpdate(integration),
    fields: [],
    color: client.customConstants.colors.loading,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case oldIntegration.enabled !== integration.enabled: {
      merge(oldIntegration.enabled, integration.enabled, 'boolean', language.Enabled);
      break;
    }
    case oldIntegration.syncing !== integration.syncing: {
      merge(oldIntegration.syncing, integration.syncing, 'boolean', lan.syncing);
      break;
    }
    case oldIntegration.roleId !== integration.roleId: {
      const oldRole = !oldIntegration.roleId
        ? language.none
        : await client.cache.roles.get(oldIntegration.roleId, integration.guildId);
      const newRole = !integration.roleId
        ? language.none
        : await client.cache.roles.get(integration.roleId, integration.guildId);

      const oldRoleText = oldRole ?? `\`${oldIntegration.roleId}\``;
      const newRoleText = newRole ?? `\`${integration.roleId}\``;

      merge(
        typeof oldRoleText === 'string'
          ? oldRoleText
          : language.languageFunction.getRole(oldRoleText),
        typeof newRoleText === 'string'
          ? newRoleText
          : language.languageFunction.getRole(newRoleText),
        'string',
        language.Role,
      );
      break;
    }
    case oldIntegration.enableEmoticons !== integration.enableEmoticons: {
      merge(
        oldIntegration.enableEmoticons,
        integration.enableEmoticons,
        'boolean',
        lan.enableEmoticons,
      );
      break;
    }
    case oldIntegration.expireBehavior !== integration.expireBehavior: {
      merge(
        oldIntegration.expireBehavior
          ? lan.expireBehavior[oldIntegration.expireBehavior]
          : language.none,
        integration.expireBehavior ? lan.expireBehavior[integration.expireBehavior] : language.none,
        'string',
        lan.expireBehaviorName,
      );
      break;
    }
    case oldIntegration.expireGracePeriod !== integration.expireGracePeriod: {
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
      break;
    }
    case oldIntegration.syncedAt !== integration.syncedAt: {
      merge(
        oldIntegration.syncedAt
          ? client.customConstants.standard.getTime(oldIntegration.syncedAt)
          : language.none,
        integration.syncedAt
          ? client.customConstants.standard.getTime(integration.syncedAt)
          : language.none,
        'string',
        lan.syncedAt,
      );
      break;
    }
    case oldIntegration.revoked !== integration.revoked: {
      merge(oldIntegration.revoked, integration.revoked, 'boolean', lan.revoked);
      break;
    }
    case oldIntegration.type !== integration.type: {
      merge(oldIntegration.type, integration.type, 'string', language.Type);
      break;
    }
    case oldIntegration.name !== integration.name: {
      merge(oldIntegration.name, integration.name, 'string', language.name);
      break;
    }
    case JSON.stringify(oldIntegration.account) !== JSON.stringify(integration.account): {
      merge(
        lan.getAccount(oldIntegration.account),
        lan.getAccount(integration.account),
        'string',
        lan.account,
      );
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: integration.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
