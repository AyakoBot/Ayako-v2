import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (rule: Discord.AutoModerationRule) => {
  const channels = await client.ch.getLogChannels('automodevents', rule.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(rule.guild.id);
  const lan = language.events.logs.automodRule;
  const con = client.customConstants.events.logs.automodRule;
  const user = await client.users.fetch(rule.creatorId);
  if (!user) return;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.create,
      name: lan.nameCreate,
    },
    description: lan.descCreate(user, rule),
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

    if (rule.triggerMetadata.allowList.length) {
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

    if (rule.triggerMetadata.presets.length) {
      embed.fields?.push({
        name: lan.presetsName,
        value: rule.triggerMetadata.presets.map((p) => lan.presets[p]).join(', '),
        inline: true,
      });
    }
  }

  embed.fields?.push({
    name: lan.eventTypeName,
    value: lan.eventType[rule.eventType],
    inline: true,
  });

  embed.fields?.push({
    name: lan.triggerTypeName,
    value: lan.triggerType[rule.triggerType],
    inline: true,
  });

  if (rule.exemptRoles?.size) {
    embed.fields?.push({
      name: lan.exemptRoles,
      value: rule.exemptRoles.map((r) => `<@&${r.id}>`).join(', '),
      inline: false,
    });
  }

  if (rule.exemptChannels?.size) {
    embed.fields?.push({
      name: lan.exemptChannels,
      value: rule.exemptChannels.map((r) => `<#${r.id}>`).join(', '),
      inline: false,
    });
  }

  const actionChannels = await Promise.all(
    rule.actions.map((r) =>
      r.metadata?.channelId
        ? client.ch.getChannel.guildTextChannel(r.metadata.channelId)
        : undefined,
    ),
  );

  const content = rule.actions
    .map(
      (a, i) =>
        `${lan.actionsTypeName}: \`${lan.actionsType[a.type]}\`${
          a.type !== 1
            ? `- ${
                a.type === 2
                  ? `${lan.alertChannel} <#${a.metadata?.channelId}>  / \`${actionChannels[i]?.name}\` / \`${a.metadata?.channelId}\``
                  : `${lan.timeoutDuration} \`${client.ch.moment(
                      a.metadata?.durationSeconds ? Number(a.metadata.durationSeconds) * 1000 : 0,
                      language,
                    )}\``
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
