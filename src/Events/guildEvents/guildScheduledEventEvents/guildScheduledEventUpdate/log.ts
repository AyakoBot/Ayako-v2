import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (
 oldEvent: Discord.GuildScheduledEvent,
 event: Discord.GuildScheduledEvent,
) => {
 const guild =
  event.guild ??
  oldEvent.guild ??
  (oldEvent.guildId || event.guildId
   ? client.guilds.cache.get(oldEvent.guildId ?? event.guildId)
   : undefined);
 if (!guild) return;

 const channels = await event.client.util.getLogChannels('scheduledeventevents', guild);
 if (!channels) return;

 const channel =
  event.channel ??
  (event.channelId
   ? (await event.client.util.getChannel.guildTextChannel(event.channelId)) ??
     (await event.client.util.getChannel.guildVoiceChannel(event.channelId))
   : undefined);
 const language = await event.client.util.getLanguage(guild.id);
 const lan = language.events.logs.scheduledEvent;
 const con = event.client.util.constants.events.logs.guild;
 const audit = await event.client.util.getAudit(guild, 101, event.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];
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

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUpdate,
   icon_url: con.ScheduledEventUpdate,
  },
  color: CT.Colors.Loading,
  fields: [],
  description,
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  event.client.util.mergeLogging(before, after, type, embed, language, name);

 if (event.image !== oldEvent.image) {
  const getImage = async () => {
   if (!event.image) {
    embed.fields?.push({ name: lan.image, value: lan.imageRemoved });
    return;
   }

   const url = event.coverImageURL({ size: 4096 });

   if (!url) {
    embed.fields?.push({ name: lan.image, value: lan.imageRemoved });
    return;
   }

   const attachment = (await event.client.util.fileURL2Buffer([url]))?.[0];

   merge(url, event.client.util.getNameAndFileType(url), 'icon', lan.image);

   if (attachment) files.push(attachment);
  };

  await getImage();
 }
 if (event.description !== oldEvent.description) {
  merge(oldEvent.description, event.description, 'string', language.t.Description);
 }
 if (!!event.entityMetadata?.location !== !!oldEvent.entityMetadata?.location) {
  merge(
   oldEvent.entityMetadata?.location ?? language.t.None,
   event.entityMetadata?.location ?? language.t.None,
   'string',
   lan.location,
  );
 }

 if (event.channelId !== oldEvent.channelId) {
  const oldChannel =
   oldEvent.channel ??
   (oldEvent.channelId
    ? (await event.client.util.getChannel.guildTextChannel(oldEvent.channelId)) ??
      (await event.client.util.getChannel.guildVoiceChannel(oldEvent.channelId))
    : undefined);

  const newChannel =
   event.channel ??
   (event.channelId
    ? (await event.client.util.getChannel.guildTextChannel(event.channelId)) ??
      (await event.client.util.getChannel.guildVoiceChannel(event.channelId))
    : undefined);

  merge(
   oldChannel
    ? language.languageFunction.getChannel(oldChannel, language.channelTypes[oldChannel.type])
    : language.t.Unknown,
   newChannel
    ? language.languageFunction.getChannel(newChannel, language.channelTypes[newChannel.type])
    : language.t.Unknown,
   'string',
   language.t.Channel,
  );
 }
 if (event.scheduledEndTimestamp !== oldEvent.scheduledEndTimestamp) {
  merge(
   oldEvent.scheduledEndTimestamp
    ? event.client.util.constants.standard.getTime(oldEvent.scheduledEndTimestamp)
    : language.t.None,
   event.scheduledEndTimestamp
    ? event.client.util.constants.standard.getTime(event.scheduledEndTimestamp)
    : language.t.None,
   'string',
   lan.scheduledEndTime,
  );
 }
 if (event.scheduledStartTimestamp !== oldEvent.scheduledStartTimestamp) {
  merge(
   oldEvent.scheduledStartTimestamp
    ? event.client.util.constants.standard.getTime(oldEvent.scheduledStartTimestamp)
    : language.t.None,
   event.scheduledStartTimestamp
    ? event.client.util.constants.standard.getTime(event.scheduledStartTimestamp)
    : language.t.None,
   'string',
   lan.scheduledStartTime,
  );
 }
 if (event.name !== oldEvent.name) {
  merge(oldEvent.name, event.name, 'string', language.t.name);
 }
 if (event.status !== oldEvent.status) {
  merge(lan.status[oldEvent.status], lan.status[event.status], 'string', lan.statusName);
 }
 if (event.privacyLevel !== oldEvent.privacyLevel) {
  merge(
   lan.privacyLevel[oldEvent.privacyLevel],
   lan.privacyLevel[event.privacyLevel],
   'string',
   lan.privacyLevelName,
  );
 }
 if (event.entityType !== oldEvent.entityType) {
  merge(
   lan.entityType[oldEvent.entityType],
   lan.entityType[event.entityType],
   'string',
   lan.entityTypeName,
  );
 }

 event.client.util.send({ id: channels, guildId: guild.id }, { embeds: [embed], files }, 10000);
};
