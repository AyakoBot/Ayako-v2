import type * as Discord from 'discord.js';
import { ch } from '../../../../BaseClient/Client.js';

export default async (integration: Discord.Integration) => {
  const channels = await ch.getLogChannels('guildevents', integration.guild);
  if (!channels) return;

  const language = await ch.languageSelector(integration.guild.id);
  const lan = language.events.logs.integration;
  const con = ch.constants.events.logs.guild;
  const audit = await ch.getAudit(integration.guild, 82, integration.id);
  const auditUser = audit?.executor ?? undefined;
  let description = '';

  if (auditUser && integration.application) {
    description = lan.descDeleteIntegrationAudit(auditUser, integration, integration.application);
  } else if (auditUser) {
    description = lan.descDeleteAudit(auditUser, integration);
  } else {
    description = lan.descDeleteIntegration(integration);
  }

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.BotDelete,
      name: lan.nameDelete,
    },
    description,
    fields: [],
    color: ch.constants.colors.danger,
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
  }

  ch.send({ id: channels, guildId: integration.guild.id }, { embeds: [embed] }, undefined, 10000);
};
