import type * as DDeno from 'discordeno';
import client from '../../BaseClient/DDenoClient.js';

export default async (execution: DDeno.AutoModerationActionExecution) => {
  const channels = await client.ch.getLogChannels('automodevents', execution);
  if (!channels) return;
  const user = await client.ch.cache.users.get(execution.userId);
  if (!user) return;

  const msg =
    execution.messageId && execution.channelId
      ? await client.ch.cache.messages.get(
          execution.messageId,
          execution.channelId,
          execution.guildId,
        )
      : null;
  const rule = await client.helpers.getAutomodRule(execution.guildId, execution.ruleId);
  const language = await client.ch.languageSelector(execution.guildId);
  const lan = language.events.logs.automodActionExecution;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: client.objectEmotes.userFlags.DiscordCertifiedModerator.link,
      name: lan.name,
      url: msg ? client.ch.getJumpLink(msg) : undefined,
    },
    description: msg ? lan.descMessage(rule, msg, user) : lan.desc(rule, user),
    color: client.customConstants.colors.warning,
    fields: [],
  };

  if (execution.ruleTriggerType) {
    embed.fields?.push({
      name: lan.ruleTriggerType[0],
      value: lan.ruleTriggerType[execution.ruleTriggerType],
      inline: true,
    });
  }

  embed.fields?.push({
    name: lan.actionType[0],
    value: lan.actionType[execution.action.type],
    inline: true,
  });

  if ([2, 3].includes(execution.action.type)) {
    const channel = execution.action.metadata.channelId
      ? await client.ch.cache.channels.get(execution.action.metadata.channelId, execution.guildId)
      : undefined;

    embed.fields?.push({
      name: execution.action.type === 2 ? lan.alert : lan.timeout,
      value:
        execution.action.type === 2
          ? `${lan.alertChannel} <@${channel?.id}> / \`${channel?.name}\` / \`${channel?.id}\`\n[${
              language.Message
            }${language.Message}](${client.ch.getJumpLink({
              guildId: execution.guildId,
              channelId: execution.action.metadata.channelId ?? 0n,
              id: execution.alertSystemMessageId ?? 0n,
            })})`
          : `${language.duration} \`${client.ch.moment(
              execution.action.metadata.durationSeconds || 0,
              language,
            )}\` / ${language.End} <t:${String(
              Number(execution.action.metadata.durationSeconds) + Date.now(),
            ).slice(0, -3)}> <t:${String(
              Number(execution.action.metadata.durationSeconds) + Date.now(),
            ).slice(0, -3)}:R>`,
      inline: true,
    });
  }

  if (execution.content) {
    embed.fields?.push({
      name: lan.content,
      value: execution.content,
      inline: false,
    });
  }

  if (execution.matchedKeyword) {
    embed.fields?.push({
      name: lan.matchedKeyword,
      value: execution.matchedKeyword,
      inline: false,
    });
  }

  if (execution.matchedContent) {
    embed.fields?.push({
      name: lan.matchedContent,
      value: execution.matchedContent,
      inline: false,
    });
  }

  client.ch.send(
    { id: channels, guildId: execution.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
