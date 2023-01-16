import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (integration: DDeno.Integration) => {
  const channels = await client.ch.getLogChannels('guildevents', integration);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(integration.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(integration.guildId);
  const lan = language.events.logs.integration;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 80, integration.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.BotCreate,
      name: lan.nameCreate,
    },
    description: auditUser
      ? lan.descCreateAudit(integration, auditUser)
      : lan.descCreate(integration),
    fields: [],
    color: client.customConstants.colors.success,
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

  client.ch.send(
    { id: channels, guildId: integration.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
