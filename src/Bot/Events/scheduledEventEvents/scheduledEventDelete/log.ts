import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (event: CT.ScheduledEvent) => {
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
  const audit = await client.ch.getAudit(guild, 102, event.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;
  const files: DDeno.FileContent[] = [];
  let description = '';

  if (auditUser && channel) {
    description = lan.descDeleteChannelAudit(
      event,
      auditUser,
      channel,
      language.channelTypes[channel.type],
    );
  } else if (auditUser) {
    description = lan.descDeleteAudit(event, auditUser);
  } else if (channel) {
    description = lan.descDeleteChannel(event, channel, language.channelTypes[channel.type]);
  } else {
    description = lan.descDelete(event);
  }

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameDelete,
      iconUrl: con.ScheduledEventDelete,
    },
    color: client.customConstants.colors.warning,
    description,
  };

  if (event.image) {
    embed.image = {
      url: `attachment://${event.image}`,
    };

    const attachment = (
      await client.ch.fileURL2Blob([client.customConstants.standard.getScheduledEventIcon(event)])
    ).filter(
      (
        e,
      ): e is {
        blob: Blob;
        name: string;
      } => !!e,
    );

    if (attachment) files.push(...attachment);
  }

  if (event.description) {
    embed.fields?.push({
      name: language.Description,
      value: event.description,
    });
  }

  if (event.location) {
    embed.fields?.push({
      name: lan.location,
      value: event.location,
    });
  }

  if (event.scheduledStartTime) {
    embed.fields?.push({
      name: lan.scheduledStartTime,
      value: client.customConstants.standard.getTime(event.scheduledStartTime),
    });
  }

  if (event.scheduledEndTime) {
    embed.fields?.push({
      name: lan.scheduledEndTime,
      value: client.customConstants.standard.getTime(event.scheduledEndTime),
    });
  }

  if (event.creator) {
    const creator = event.creator ?? (await client.ch.cache.users.get(event.creatorId));

    embed.fields?.push({
      name: lan.creator,
      value: language.languageFunction.getUser(creator),
    });
  }

  embed.fields?.push(
    {
      name: lan.statusName,
      value: lan.status[event.status],
    },
    {
      name: lan.privacyLevelName,
      value: lan.privacyLevel[event.status as keyof typeof lan.privacyLevel],
    },
    {
      name: lan.entityTypeName,
      value: lan.entityType[event.entityType],
    },
  );

  if (event.users?.length) {
    const attachment = client.ch.txtFileWriter(event.users.join(', '), undefined, lan.participants);
    if (attachment) files.push(attachment);
  }

  client.ch.send(
    { id: channels, guildId: event.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
