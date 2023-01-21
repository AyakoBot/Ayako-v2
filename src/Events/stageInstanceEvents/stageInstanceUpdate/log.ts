import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldStage: Discord.StageInstance, stage: Discord.StageInstance) => {
  if (!stage.guild) return;
  if (!stage.channel) return;

  const channels = await client.ch.getLogChannels('stageevents', stage.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(stage.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(stage.guild, 84, stage.id);
  const auditUser = audit?.executor ?? undefined;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameStageUpdate,
      icon_url: con.StageUpdate,
    },
    color: client.customConstants.colors.loading,
    description: auditUser
      ? lan.descUpdateStageAudit(
          stage.channel,
          language.channelTypes[stage.channel.type],
          auditUser,
        )
      : lan.descUpdateStage(stage.channel, language.channelTypes[stage.channel.type]),
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case oldStage.guildScheduledEventId !== stage.guildScheduledEventId: {
      merge(
        oldStage.guildScheduledEvent
          ? language.languageFunction.getScheduledEvent(oldStage.guildScheduledEvent)
          : language.none,
        stage.guildScheduledEvent
          ? language.languageFunction.getScheduledEvent(stage.guildScheduledEvent)
          : language.none,
        'string',
        language.ScheduledEvent,
      );
      break;
    }
    case oldStage.topic !== stage.topic: {
      merge(oldStage.topic, stage.topic, 'string', lan.topic);
      break;
    }
    case oldStage.channelId !== stage.channelId: {
      merge(
        oldStage.channel
          ? language.languageFunction.getChannel(
              oldStage.channel,
              language.channelTypes[oldStage.channel.type],
            )
          : language.unknown,
        stage.channel
          ? language.languageFunction.getChannel(
              stage.channel,
              language.channelTypes[stage.channel.type],
            )
          : language.unknown,
        'string',
        language.Channel,
      );
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: stage.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
