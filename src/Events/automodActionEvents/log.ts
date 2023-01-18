import type * as Discord from 'discord.js';
import client from '../../BaseClient/Client.js';

export default async (execution: Discord.AutoModerationActionExecution) => {
  const channels = await client.ch.getLogChannels('automodevents', execution.guild);
  if (!channels) return;

  const user = await client.users.fetch(execution.userId);
  if (!user) return;

  const rule = (await execution.guild.autoModerationRules.fetch())?.get(execution.ruleId);
  if (!rule) return;

  const channel = execution.channelId
    ? await client.ch.getGuildTextChannel(execution.channelId)
    : undefined;
  const msg =
    execution.messageId && channel ? await channel.messages.fetch(execution.messageId) : undefined;
  const language = await client.ch.languageSelector(execution.guild.id);
  const lan = language.events.logs.automodActionExecution;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: client.objectEmotes.userFlags.DiscordCertifiedModerator.link,
      name: lan.name,
      url: msg ? msg.url : undefined,
    },
    description: msg ? lan.descMessage(rule, msg, user) : lan.desc(rule, user),
    color: client.customConstants.colors.warning,
    fields: [],
  };

  if (execution.ruleTriggerType) {
    embed.fields?.push({
      name: lan.ruleTriggerTypeName,
      value: lan.ruleTriggerType[execution.ruleTriggerType],
      inline: true,
    });
  }

  embed.fields?.push({
    name: lan.actionTypeName,
    value: lan.actionType[execution.action.type],
    inline: true,
  });

  if ([2, 3].includes(execution.action.type)) {
    embed.fields?.push({
      name: execution.action.type === 2 ? lan.alert : lan.timeout,
      value:
        execution.action.type === 2
          ? `${lan.alertChannel} <@${channel?.id}> / \`${channel?.name}\` / \`${channel?.id}\`\n[${
              language.Message
            }${language.Message}](${client.ch.getJumpLink({
              guildId: execution.guild.id,
              channelId: execution.action.metadata.channelId ?? '',
              id: execution.alertSystemMessageId ?? '',
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
    { id: channels, guildId: execution.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
