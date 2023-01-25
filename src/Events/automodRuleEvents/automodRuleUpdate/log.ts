import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (
  oldRule: Discord.AutoModerationRule | undefined,
  rule: Discord.AutoModerationRule,
) => {
  if (!rule.guild.id) return;

  const channels = await client.ch.getLogChannels('automodevents', rule.guild);
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
    description: lan.descUpdate(user, rule),
    fields: [],
    color: client.customConstants.colors.loading,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  if (rule.name !== oldRule?.name) {
    merge(oldRule?.name, rule.name, 'string', language.name);
  }
  if (rule.enabled !== oldRule?.enabled) {
    merge(oldRule?.enabled, rule.enabled, 'boolean', lan.enabled);
  }
  if (rule.eventType !== oldRule?.eventType) {
    merge(
      oldRule?.eventType ? lan.eventType[oldRule.eventType] : language.unknown,
      lan.eventType[rule.eventType],
      'string',
      lan.eventTypeName,
    );
  }
  if (rule.triggerType !== oldRule?.triggerType) {
    merge(
      oldRule?.triggerType ? lan.triggerType[oldRule?.triggerType] : language.unknown,
      lan.triggerType[rule.triggerType],
      'string',
      lan.triggerTypeName,
    );
  }
  if (rule.triggerMetadata?.mentionTotalLimit !== oldRule?.triggerMetadata?.mentionTotalLimit) {
    merge(
      oldRule?.triggerMetadata?.mentionTotalLimit,
      rule.triggerMetadata?.mentionTotalLimit,
      'string',
      lan.mentionTotalLimit,
    );
  }
  if (JSON.stringify(rule.exemptRoles) !== JSON.stringify(oldRule?.exemptRoles)) {
    merge(
      client.ch
        .getDifference(
          rule.exemptRoles.map((r) => r.id),
          oldRule?.exemptRoles.map((r) => r.id) ?? [],
        )
        .map((r) => `<@&${r}>`)
        .join(', '),
      client.ch
        .getDifference(
          oldRule?.exemptRoles.map((r) => r.id) ?? [],
          rule.exemptRoles.map((r) => r.id),
        )
        .map((r) => `<@&${r}>`)
        .join(', '),
      'difference',
      lan.exemptRoles,
    );
  }
  if (JSON.stringify(rule.exemptChannels) !== JSON.stringify(oldRule?.exemptChannels)) {
    merge(
      client.ch
        .getDifference(
          rule.exemptChannels.map((r) => r.id),
          oldRule?.exemptChannels.map((r) => r.id) ?? [],
        )
        .map((r) => `<#${r}>`)
        .join(', '),
      client.ch
        .getDifference(
          oldRule?.exemptChannels.map((r) => r.id) ?? [],
          rule.exemptChannels.map((r) => r.id),
        )
        .map((r) => `<#${r}>`)
        .join(', '),
      'difference',
      lan.exemptChannels,
    );
  }
  if (
    JSON.stringify(rule.triggerMetadata?.keywordFilter) !==
    JSON.stringify(oldRule?.triggerMetadata?.keywordFilter)
  ) {
    merge(
      client.ch
        .getDifference(
          rule.triggerMetadata?.keywordFilter ?? [],
          oldRule?.triggerMetadata?.keywordFilter ?? [],
        )
        .map((r) => `\`${r}\``)
        .join(', '),
      client.ch
        .getDifference(
          oldRule?.triggerMetadata?.keywordFilter ?? [],
          rule.triggerMetadata?.keywordFilter ?? [],
        )
        .map((r) => `\`${r}\``)
        .join(', '),
      'difference',
      lan.keywordFilter,
    );
  }
  if (
    JSON.stringify(rule.triggerMetadata?.presets) !==
    JSON.stringify(oldRule?.triggerMetadata?.presets)
  ) {
    merge(
      client.ch
        .getDifference(
          (rule.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
          (oldRule?.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
        )
        .map((r) => `\`${r}\``)
        .join(', '),
      client.ch
        .getDifference(
          (rule.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
          (oldRule?.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
        )
        .map((r) => `\`${r}\``)
        .join(', '),
      'difference',
      lan.presetsName,
    );
  }
  if (
    JSON.stringify(rule.triggerMetadata?.allowList) !==
    JSON.stringify(oldRule?.triggerMetadata?.allowList)
  ) {
    merge(
      client.ch
        .getDifference(
          rule.triggerMetadata?.allowList ?? [],
          oldRule?.triggerMetadata?.allowList ?? [],
        )
        .map((r) => `\`${r}\``)
        .join(', '),
      client.ch
        .getDifference(
          rule.triggerMetadata?.allowList ?? [],
          oldRule?.triggerMetadata?.allowList ?? [],
        )
        .map((r) => `\`${r}\``)
        .join(', '),
      'difference',
      lan.allowList,
    );
  }
  if (JSON.stringify(rule.actions) === JSON.stringify(oldRule?.actions)) return;
  const addedActions = client.ch.getDifference(
    rule.actions,
    oldRule?.actions ?? [],
  ) as Discord.AutoModerationRule['actions'];
  const removedActions = client.ch.getDifference(
    oldRule?.actions ?? [],
    rule.actions,
  ) as Discord.AutoModerationRule['actions'];
  const changedActions = client.ch.getChanged(
    rule.actions as unknown as { [key: string]: unknown }[],
    (oldRule?.actions ?? []) as unknown as { [key: string]: unknown }[],
    'id',
  ) as unknown as Discord.AutoModerationRule['actions'];

  const addedChannels = await Promise.all(
    addedActions.map((a) =>
      a.metadata?.channelId
        ? client.ch.getChannel.guildTextChannel(a.metadata.channelId)
        : undefined,
    ),
  );
  const removedChannels = await Promise.all(
    removedActions.map((a) =>
      a.metadata?.channelId
        ? client.ch.getChannel.guildTextChannel(a.metadata.channelId)
        : undefined,
    ),
  );
  const changedChannels = await Promise.all(
    changedActions.map((a) =>
      a.metadata?.channelId
        ? client.ch.getChannel.guildTextChannel(a.metadata.channelId)
        : undefined,
    ),
  );

  const getActionContent = (
    array: Discord.AutoModerationRule['actions'],
    channel: (
      | Discord.PrivateThreadChannel
      | Discord.PublicThreadChannel<boolean>
      | Discord.NewsChannel
      | Discord.TextChannel
      | Discord.VoiceChannel
      | undefined
    )[],
  ) =>
    array
      .map(
        (action, i) =>
          `${lan.actionsTypeName}: \`${lan.actionsType[action.type]}\`${
            action.type !== 1
              ? `- ${
                  action.type === 2
                    ? `${lan.alertChannel} <#${action.metadata.channelId}>  / \`${channel[i]?.name}\` / \`${action.metadata?.channelId}\``
                    : `${lan.timeoutDuration} ${client.ch.moment(
                        action.metadata?.durationSeconds || 0,
                        language,
                      )}`
                }`
              : ''
          }`,
      )
      .join('\n');

  const addedContent = getActionContent(addedActions, addedChannels);
  const removedContent = getActionContent(removedActions, removedChannels);
  const changedContent = getActionContent(changedActions, changedChannels);

  if (addedContent) {
    embed.fields?.push({ name: language.Added, value: addedContent, inline: false });
  }

  if (removedContent) {
    embed.fields?.push({ name: language.Added, value: removedContent, inline: false });
  }

  if (changedContent) {
    embed.fields?.push({ name: language.Added, value: changedContent, inline: false });
  }

  client.ch.send(
    { id: channels, guildId: rule.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
