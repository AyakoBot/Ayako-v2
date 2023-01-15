import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (oldEvent: CT.ScheduledEvent, event: CT.ScheduledEvent) => {
  const channels = await client.ch.getLogChannels('scheduledevents', event);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(event.guildId);
  if (!guild) return;

  const channel = event.channelId
    ? await client.ch.cache.channels.get(event.channelId, event.guildId)
    : undefined;
  const language = await client.ch.languageSelector(event.guildId);
  const lan = language.events.logs.scheduledEvent;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 101, event.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;
  const files: DDeno.FileContent[] = [];
  let description = '';

  if (auditUser && channel) {
    description = lan.descUpdateChannelAudit(
      event,
      auditUser,
      channel,
      language.channelTypes[channel.type],
    );
  } else if (auditUser) {
    description = lan.descUpdateAudit(event, auditUser);
  } else if (channel) {
    description = lan.descUpdateChannel(event, channel, language.channelTypes[channel.type]);
  } else {
    description = lan.descUpdate(event);
  }

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameUpdate,
      iconUrl: con.ScheduledEventUpdate,
    },
    color: client.customConstants.colors.loading,
    description,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case event.image !== oldEvent.image: {
      if (event.image) {
        const url = client.customConstants.standard.getScheduledEventIcon(event);
        const blob = (await client.ch.fileURL2Blob([url]))?.[0]?.blob;

        merge(url, event.image, 'icon', lan.image);

        if (blob) {
          files.push({
            name: String(event.image),
            blob,
          });
        }
        break;
      } else embed.fields?.push({ name: lan.image, value: lan.imageRemoved });
      break;
    }
    case event.description !== oldEvent.description: {
      merge(oldEvent.description, event.description, 'string', language.Description);
      break;
    }
    case event.location !== oldEvent.location: {
      merge(oldEvent.location, event.location, 'string', lan.location);
      break;
    }
    case event.channelId !== oldEvent.channelId: {
      const oldChannel = oldEvent.channelId
        ? await client.ch.cache.channels.get(oldEvent.channelId, oldEvent.guildId)
        : undefined;

      const newChannel = event.channelId
        ? await client.ch.cache.channels.get(event.channelId, event.guildId)
        : undefined;

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
    case event.scheduledEndTime !== oldEvent.scheduledEndTime: {
      merge(
        oldEvent.scheduledEndTime
          ? client.customConstants.standard.getTime(oldEvent.scheduledEndTime)
          : language.none,
        event.scheduledEndTime
          ? client.customConstants.standard.getTime(event.scheduledEndTime)
          : language.none,
        'string',
        lan.scheduledEndTime,
      );
      break;
    }
    case event.scheduledStartTime !== oldEvent.scheduledStartTime: {
      merge(
        oldEvent.scheduledStartTime
          ? client.customConstants.standard.getTime(oldEvent.scheduledStartTime)
          : language.none,
        event.scheduledStartTime
          ? client.customConstants.standard.getTime(event.scheduledStartTime)
          : language.none,
        'string',
        lan.scheduledStartTime,
      );
      break;
    }
    case event.name !== oldEvent.name: {
      merge(oldEvent.name, event.name, 'string', language.name);
      break;
    }
    case event.status !== oldEvent.status: {
      merge(lan.status[oldEvent.status], lan.status[event.status], 'string', lan.statusName);
      break;
    }
    case event.privacyLevel !== oldEvent.privacyLevel: {
      merge(
        lan.privacyLevel[oldEvent.privacyLevel],
        lan.privacyLevel[event.privacyLevel],
        'string',
        lan.privacyLevelName,
      );
      break;
    }
    case event.entityType !== oldEvent.entityType: {
      merge(
        lan.entityType[oldEvent.entityType],
        lan.entityType[event.entityType],
        'string',
        lan.entityTypeName,
      );
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: event.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
