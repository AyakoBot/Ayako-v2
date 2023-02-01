import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (event: Discord.GuildScheduledEvent) => {
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
    description = lan.descCreateChannelAudit(
      event,
      auditUser,
      channel,
      language.channelTypes[channel.type],
    );
  } else if (auditUser) {
    description = lan.descCreateAudit(event, auditUser);
  } else if (channel) {
    description = lan.descCreateChannel(event, channel, language.channelTypes[channel.type]);
  } else {
    description = lan.descCreate(event);
  }

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameCreate,
      icon_url: con.ScheduledEventCreate,
    },
    color: client.customConstants.colors.danger,
    description,
  };

  if (event.image) {
    const getImage = async () => {
      const url = event.coverImageURL({ size: 4096 });

      if (!url) return;
      embed.image = {
        url: `attachment://${client.ch.getNameAndFileType(url)}`,
      };

      const attachment = (await client.ch.fileURL2Buffer([url]))?.[0];
      if (attachment) files.push(attachment);
    };

    getImage();
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
      value: event.entityMetadata.location,
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

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
