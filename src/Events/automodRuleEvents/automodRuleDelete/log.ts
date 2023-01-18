import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guild.id) return;

  const channels = await client.ch.getLogChannels('automodevents', rule);
  if (!channels) return;

  const language = await client.ch.languageSelector(rule.guild.id);
  const lan = language.events.logs.automodRule;
  const con = client.customConstants.events.logs.automodRule;
  const user = await client.users.fetch(rule.creatorId);
  if (!user) return;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.delete,
      name: lan.name,
    },
    description: lan.descDelete(user, rule),
    fields: [],
    color: client.customConstants.colors.success,
  };

  if (rule.triggerMetadata) {
    if (rule.triggerMetadata.keywordFilter?.length) {
      embed.fields?.push({
        name: lan.keywordFilter,
        value: rule.triggerMetadata.keywordFilter.map((w) => `\`${w}\``).join(', '),
        inline: false,
      });
    }

    if (rule.triggerMetadata.allowList) {
      embed.fields?.push({
        name: lan.allowList,
        value: rule.triggerMetadata.allowList.map((w) => `\`${w}\``).join(', '),
        inline: false,
      });
    }

    if (rule.triggerMetadata.mentionTotalLimit) {
      embed.fields?.push({
        name: lan.mentionTotalLimit,
        value: String(rule.triggerMetadata.mentionTotalLimit),
        inline: true,
      });
    }

    if (rule.triggerMetadata.presets) {
      embed.fields?.push({
        name: lan.presets[0],
        value: rule.triggerMetadata.presets.map((p) => lan.presets[p]).join(', '),
        inline: true,
      });
    }
  }

  embed.fields?.push({
    name: lan.eventType[0],
    value: lan.eventType[rule.eventType],
    inline: true,
  });

  embed.fields?.push({
    name: lan.triggerType[0],
    value: lan.triggerType[rule.triggerType],
    inline: true,
  });

  if (rule.exemptRoles?.length) {
    embed.fields?.push({
      name: lan.exemptRoles,
      value: rule.exemptRoles.map((r) => `<@&${r}`).join(', '),
      inline: false,
    });
  }

  if (rule.exemptChannels?.length) {
    embed.fields?.push({
      name: lan.exemptChannels,
      value: rule.exemptChannels.map((r) => `<#${r}`).join(', '),
      inline: false,
    });
  }

  const actionChannels = await Promise.all(
    rule.actions.map((r) =>
      r.metadata?.channelId
        ? client.ch.cache.channels.get(r.metadata?.channelId, rule.guild.id)
        : undefined,
    ),
  );

  const content = rule.actions
    .map(
      (a, i) =>
        `${lan.actionsType[0]}: \`${lan.actionsType[a.type]}\`${
          a.type !== 1
            ? `- ${
                a.type === 2
                  ? `${lan.alertChannel} <#${a.metadata?.channelId}>  / \`${actionChannels[i]?.name}\` / \`${a.metadata?.channelId}\``
                  : `${lan.timeoutDuration} ${client.ch.moment(
                      a.metadata?.durationSeconds || 0,
                      language,
                    )}`
              }`
            : ''
        }`,
    )
    .join('\n');

  embed.fields?.push({
    name: lan.actions,
    value: content,
    inline: false,
  });

  embed.fields?.push({
    name: lan.enabled,
    value: rule.enabled
      ? `${client.stringEmotes.tickWithBackground} ${language.Enabled}`
      : `${client.stringEmotes.crossWithBackground} ${language.Disabled}`,
    inline: true,
  });

  client.ch.send(
    { id: channels, guildId: rule.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
