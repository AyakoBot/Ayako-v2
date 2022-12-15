import moment from 'moment';
import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';
import 'moment-duration-format';

export default async (rule: DDeno.AutoModerationRule) => {
  if (!rule.guildId) return;

  const channels = await client.ch.getLogChannels('reactionevents', rule);
  if (!channels) return;

  const language = await client.ch.languageSelector(rule.guildId);
  const lan = language.events.logs.automodRuleCreate;
  const con = client.customConstants.events.logs.automodRule;
  const user = await client.cache.users.get(rule.creatorId);
  if (!user) return;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.create,
      name: lan.name,
    },
    description: lan.desc(user, rule),
    fields: [],
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
      r.metadata?.channelId ? client.cache.channels.get(r.metadata?.channelId) : undefined,
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
                  : `${lan.timeoutDuration} ${moment
                      .duration(a.metadata?.durationSeconds)
                      .format(
                        `y [${language.time.years}], M [${language.time.months}], d [${language.time.days}], h [${language.time.hours}], m [${language.time.minutes}], s [${language.time.seconds}]`,
                        { trim: 'all' },
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
    { id: channels, guildId: rule.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
