import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (execution: Discord.AutoModerationActionExecution) => {
  const channels = await ch.getLogChannels('automodevents', execution.guild);
  if (!channels) return;

  const user = await ch.getUser(execution.userId);
  if (!user) return;

  const rule = (await execution.guild.autoModerationRules.fetch())?.get(execution.ruleId);
  if (!rule) return;

  const channel = execution.channelId
    ? await ch.getChannel.guildTextChannel(execution.channelId)
    : undefined;
  const msg =
    execution.messageId && channel ? await channel.messages.fetch(execution.messageId) : undefined;
  const language = await ch.languageSelector(execution.guild.id);
  const lan = language.events.logs.automodActionExecution;

  const files: Discord.AttachmentPayload[] = [];
  const embed: Discord.APIEmbed = {
    author: {
      icon_url: ch.objectEmotes.userFlags.DiscordCertifiedModerator.link,
      name: lan.name,
      url: msg ? msg.url : undefined,
    },
    description: msg ? lan.descMessage(rule, msg, user) : lan.desc(rule, user),
    color: ch.constants.colors.danger,
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

  if ('duration_seconds' in execution.action.metadata) {
    execution.action.metadata.durationSeconds = execution.action.metadata
      .duration_seconds as number;
  }

  if ([2, 3].includes(execution.action.type)) {
    embed.fields?.push({
      name: execution.action.type === 2 ? lan.alert : lan.timeout,
      value:
        execution.action.type === 2
          ? `${lan.alertChannel} <#${channel?.id}> / \`${channel?.name}\` / \`${channel?.id}\`\n[${
              language.Message
            }](${ch.getJumpLink({
              guildId: execution.guild.id,
              channelId: execution.action.metadata.channelId ?? '',
              id: execution.alertSystemMessageId ?? '',
            })})`
          : `${language.duration} \`${ch.moment(
              execution.action.metadata.durationSeconds
                ? Number(execution.action.metadata.durationSeconds) * 1000
                : 0,
              language,
            )}\` / ${language.End} ${ch.constants.standard.getTime(
              Number(execution.action.metadata.durationSeconds) * 1000 + Date.now(),
            )}`,
      inline: true,
    });
  }

  if (execution.content) {
    if (execution.content?.length > 1024) {
      const content = ch.txtFileWriter(execution.content, undefined, language.content);
      if (content) files.push(content);
    } else {
      embed.fields?.push({
        name: language.content,
        value: execution.content ?? language.None,
        inline: false,
      });
    }
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

  ch.send(
    { id: channels, guildId: execution.guild.id },
    { embeds: [embed], files },
    undefined,
    10000,
  );
};
