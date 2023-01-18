import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  payload: { id: bigint; guildId: bigint; applicationId: bigint },
  integration: DDeno.Integration | undefined,
) => {
  const channels = await client.ch.getLogChannels('guildevents', payload);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(payload.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(payload.guildId);
  const lan = language.events.logs.integration;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 82, payload.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;
  let description = '';

  if (auditUser && integration) {
    description = lan.descDeleteIntegrationAudit(auditUser, integration);
  } else if (auditUser) {
    description = lan.descDeleteAudit(auditUser, payload.applicationId);
  } else if (integration) {
    description = lan.descDeleteIntegration(integration);
  } else {
    description = lan.descDelete(payload.applicationId, payload.id);
  }

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.BotDelete,
      name: lan.nameDelete,
    },
    description,
    fields: [],
    color: client.customConstants.colors.warning,
  };

  if (integration) {
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
        name: lan.flagsName,
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

    if (integration.roleId) {
      const role = await client.ch.cache.roles.get(integration.roleId, guild.id);

      embed.fields?.push({
        name: language.Role,
        value: role ? language.languageFunction.getRole(role) : String(integration.roleId),
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
        value: client.ch.moment(integration.expireGracePeriod, language),
      });
    }

    if (integration.expireGracePeriod) {
      embed.fields?.push({
        name: lan.expireGracePeriod,
        value: client.ch.moment(integration.expireGracePeriod, language),
      });
    }

    if (integration.syncedAt) {
      embed.fields?.push({
        name: lan.syncedAt,
        value: client.customConstants.standard.getTime(integration.syncedAt),
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
        value: `${language.languageFunction.getApplication(
          integration.application as DDeno.Application,
        )}${
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
  }

  client.ch.send(
    { id: channels, guildId: payload.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
