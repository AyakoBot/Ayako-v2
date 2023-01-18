import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldStage: DDeno.StageInstance, newStage: DDeno.StageInstance) => {
  const channels = await client.ch.getLogChannels('stageevents', oldStage);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(newStage.id);
  if (!guild) return;

  const channel = await client.ch.cache.channels.get(oldStage.channelId, newStage.guildId);
  if (!channel) return;

  const language = await client.ch.languageSelector(newStage.guildId);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(guild, 84, newStage.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameStageUpdate,
      iconUrl: con.StageUpdate,
    },
    color: client.customConstants.colors.loading,
    description: auditUser
      ? lan.descUpdateStageAudit(channel, language.channelTypes[channel.type], auditUser)
      : lan.descUpdateStage(channel, language.channelTypes[channel.type]),
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case oldStage.guildScheduledEventId !== newStage.guildScheduledEventId: {
      const oldScheduledEvent = oldStage.guildScheduledEventId
        ? await client.ch.cache.scheduledEvents.get(
            oldStage.guildScheduledEventId,
            oldStage.guildId,
          )
        : undefined;

      const newScheduledEvent = newStage.guildScheduledEventId
        ? await client.ch.cache.scheduledEvents.get(
            newStage.guildScheduledEventId,
            newStage.guildId,
          )
        : undefined;

      merge(
        oldScheduledEvent
          ? language.languageFunction.getScheduledEvent(oldScheduledEvent)
          : language.none,
        newScheduledEvent
          ? language.languageFunction.getScheduledEvent(newScheduledEvent)
          : language.none,
        'string',
        language.ScheduledEvent,
      );
      break;
    }
    case oldStage.topic !== newStage.topic: {
      merge(oldStage.topic, newStage.topic, 'string', lan.topic);
      break;
    }
    case oldStage.channelId !== newStage.channelId: {
      const oldChannel = await client.ch.cache.channels.get(oldStage.channelId, oldStage.guildId);
      const newChannel = await client.ch.cache.channels.get(newStage.channelId, newStage.guildId);

      merge(
        oldChannel
          ? language.languageFunction.getChannel(oldChannel, language.channelTypes[oldChannel.type])
          : language.unknown,
        newChannel
          ? language.languageFunction.getChannel(newChannel, language.channelTypes[newChannel.type])
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
    { id: channels, guildId: oldStage.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
