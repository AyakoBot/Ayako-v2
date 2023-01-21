import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (
  event: Discord.GuildScheduledEvent,
  users: Map<string, Discord.User> | undefined,
) => {
  const guild = event.guild ?? client.guilds.cache.get(event.guildId);
  if (!guild) return;

  const channels = await client.ch.getLogChannels('scheduledeventevents', guild);
  if (!channels) return;

  const channel =
    event.channel ??
    (event.channelId
      ? (await client.ch.getChannel.guildTextChannel(event.channelId)) ??
        (await client.ch.getChannel.guildVoiceChannel(event.channelId))
      : undefined);
  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.scheduledEvent;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 102, event.id);
  const auditUser = audit?.executor ?? undefined;
  const files: Discord.AttachmentPayload[] = [];
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

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameDelete,
      icon_url: con.ScheduledEventDelete,
    },
    color: client.customConstants.colors.warning,
    description,
  };

  if (event.image) {
    embed.image = {
      url: `attachment://${event.image}`,
    };

    const attachment = (await client.ch.fileURL2Buffer([event.coverImageURL({ size: 4096 })])).filter(
      (e): e is Discord.AttachmentPayload => !!e,
    );
    if (attachment) files.push(...attachment);
  }

  if (event.description) {
    embed.fields?.push({
      name: language.Description,
      value: event.description,
    });
  }

  if (event.entityMetadata?.location) {
    embed.fields?.push({
      name: lan.location,
      value: event.entityMetadata?.location,
    });
  }

  if (event.scheduledStartTimestamp) {
    embed.fields?.push({
      name: lan.scheduledStartTime,
      value: client.customConstants.standard.getTime(event.scheduledStartTimestamp),
    });
  }

  if (event.scheduledEndTimestamp) {
    embed.fields?.push({
      name: lan.scheduledEndTime,
      value: client.customConstants.standard.getTime(event.scheduledEndTimestamp),
    });
  }

  if (event.creator || event.creatorId) {
    const creator =
      event.creator ?? (event.creatorId ? await client.users.fetch(event.creatorId) : undefined);

    if (creator) {
      embed.fields?.push({
        name: lan.creator,
        value: language.languageFunction.getUser(creator),
      });
    }
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

  if (users?.size) {
    const attachment = client.ch.txtFileWriter(
      Array.from(users, ([, u]) => u).join(', '),
      undefined,
      lan.participants,
    );
    if (attachment) files.push(attachment);
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
