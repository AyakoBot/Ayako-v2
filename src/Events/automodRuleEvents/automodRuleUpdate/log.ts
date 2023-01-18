import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (rule: DDeno.AutoModerationRule, oldRule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;

  const channels = await client.ch.getLogChannels('automodevents', rule);
  if (!channels) return;

  const language = await client.ch.languageSelector(rule.guildId);
  const lan = language.events.logs.automodRule;
  const con = client.customConstants.events.logs.automodRule;
  const user = await client.ch.cache.users.get(rule.creatorId);
  if (!user) return;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.delete,
      name: lan.name,
    },
    description: lan.descUpdate(user, rule),
    fields: [],
    color: client.customConstants.colors.loading,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case rule.name !== oldRule.name: {
      merge(oldRule.name, rule.name, 'string', language.name);
      break;
    }
    case rule.enabled !== oldRule.enabled: {
      merge(oldRule.enabled, rule.enabled, 'boolean', lan.enabled);
      break;
    }
    case rule.eventType !== oldRule.eventType: {
      merge(
        lan.eventType[oldRule.eventType],
        lan.eventType[rule.eventType],

        'string',
        lan.eventType[0],
      );
      break;
    }
    case rule.triggerType !== oldRule.triggerType: {
      merge(
        lan.triggerType[oldRule.triggerType],
        lan.triggerType[rule.triggerType],
        'string',
        lan.triggerType[0],
      );
      break;
    }
    case rule.triggerMetadata?.mentionTotalLimit !== oldRule.triggerMetadata?.mentionTotalLimit: {
      merge(
        oldRule.triggerMetadata?.mentionTotalLimit,
        rule.triggerMetadata?.mentionTotalLimit,
        'string',
        lan.mentionTotalLimit,
      );
      break;
    }
    case JSON.stringify(rule.exemptRoles) !== JSON.stringify(oldRule.exemptRoles): {
      merge(
        client.ch
          .getDifference(rule.exemptRoles, oldRule.exemptRoles)
          .map((r) => `<@&${r}>`)
          .join(', '),
        client.ch
          .getDifference(oldRule.exemptRoles, rule.exemptRoles)
          .map((r) => `<@&${r}>`)
          .join(', '),
        'difference',
        lan.exemptRoles,
      );
      break;
    }
    case JSON.stringify(rule.exemptChannels) !== JSON.stringify(oldRule.exemptChannels): {
      merge(
        client.ch
          .getDifference(rule.exemptChannels, oldRule.exemptChannels)
          .map((r) => `<#${r}>`)
          .join(', '),
        client.ch
          .getDifference(oldRule.exemptChannels, rule.exemptChannels)
          .map((r) => `<#${r}>`)
          .join(', '),
        'difference',
        lan.exemptChannels,
      );
      break;
    }
    case JSON.stringify(rule.triggerMetadata?.keywordFilter) !==
      JSON.stringify(oldRule.triggerMetadata?.keywordFilter): {
      merge(
        client.ch
          .getDifference(
            rule.triggerMetadata?.keywordFilter ?? [],
            oldRule.triggerMetadata?.keywordFilter ?? [],
          )
          .map((r) => `\`${r}\``)
          .join(', '),
        client.ch
          .getDifference(
            oldRule.triggerMetadata?.keywordFilter ?? [],
            rule.triggerMetadata?.keywordFilter ?? [],
          )
          .map((r) => `\`${r}\``)
          .join(', '),
        'difference',
        lan.keywordFilter,
      );
      break;
    }
    case JSON.stringify(rule.triggerMetadata?.presets) !==
      JSON.stringify(oldRule.triggerMetadata?.presets): {
      merge(
        client.ch
          .getDifference(
            (rule.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
            (oldRule.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
          )
          .map((r) => `\`${r}\``)
          .join(', '),
        client.ch
          .getDifference(
            (rule.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
            (oldRule.triggerMetadata?.presets ?? []).map((p) => lan.presets[p]),
          )
          .map((r) => `\`${r}\``)
          .join(', '),
        'difference',
        lan.presets[0],
      );
      break;
    }
    case JSON.stringify(rule.triggerMetadata?.allowList) !==
      JSON.stringify(oldRule.triggerMetadata?.allowList): {
      merge(
        client.ch
          .getDifference(
            rule.triggerMetadata?.allowList ?? [],
            oldRule.triggerMetadata?.allowList ?? [],
          )
          .map((r) => `\`${r}\``)
          .join(', '),
        client.ch
          .getDifference(
            rule.triggerMetadata?.allowList ?? [],
            oldRule.triggerMetadata?.allowList ?? [],
          )
          .map((r) => `\`${r}\``)
          .join(', '),
        'difference',
        lan.allowList,
      );
      break;
    }
    default: {
      if (JSON.stringify(rule.actions) === JSON.stringify(oldRule.actions)) return;
      const addedActions = client.ch.getDifference(
        rule.actions,
        oldRule.actions,
      ) as DDeno.AutoModerationRule['actions'];
      const removedActions = client.ch.getDifference(
        oldRule.actions,
        rule.actions,
      ) as DDeno.AutoModerationRule['actions'];
      const changedActions = client.ch.getChanged(
        rule.actions,
        oldRule.actions,
        'id',
      ) as DDeno.AutoModerationRule['actions'];

      const addedChannels = await Promise.all(
        addedActions.map((a) =>
          a.metadata?.channelId
            ? client.ch.cache.channels.get(a.metadata?.channelId, rule.guildId)
            : undefined,
        ),
      );
      const removedChannels = await Promise.all(
        removedActions.map((a) =>
          a.metadata?.channelId
            ? client.ch.cache.channels.get(a.metadata?.channelId, rule.guildId)
            : undefined,
        ),
      );
      const changedChannels = await Promise.all(
        changedActions.map((a) =>
          a.metadata?.channelId
            ? client.ch.cache.channels.get(a.metadata?.channelId, rule.guildId)
            : undefined,
        ),
      );

      const getActionContent = (
        array: DDeno.AutoModerationRule['actions'],
        channel: (DDeno.Channel | undefined)[],
      ) =>
        array
          .map(
            (action, i) =>
              `${lan.actionsType[0]}: \`${lan.actionsType[action.type]}\`${
                action.type !== 1
                  ? `- ${
                      action.type === 2
                        ? `${lan.alertChannel} <#${action.metadata?.channelId}>  / \`${channel[i]?.name}\` / \`${action.metadata?.channelId}\``
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
    }
  }

  client.ch.send(
    { id: channels, guildId: rule.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
