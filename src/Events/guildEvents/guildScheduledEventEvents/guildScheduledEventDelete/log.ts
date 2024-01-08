import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (
 event: Discord.GuildScheduledEvent,
 users: Map<string, Discord.User> | undefined,
) => {
 const guild = event.guild ?? client.guilds.cache.get(event.guildId);
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
 const audit = await event.client.util.getAudit(guild, 102, event.id);
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
  color: CT.Colors.Danger,
  fields: [],
  description,
  timestamp: new Date().toISOString(),
 };

 if (event.image) {
  const getImage = async () => {
   const url = event.coverImageURL({ size: 4096 });
   if (!url) return;

   embed.image = {
    url: `attachment://${event.client.util.getNameAndFileType(url)}`,
   };

   const attachment = (await event.client.util.fileURL2Buffer([url])).filter(
    (e): e is Discord.AttachmentPayload => !!e,
   );
   if (attachment) files.push(...attachment);
  };

  await getImage();
 }

 if (event.description) {
  embed.fields?.push({
   name: language.t.Description,
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
   value: event.client.util.constants.standard.getTime(event.scheduledStartTimestamp),
  });
 }

 if (event.scheduledEndTimestamp) {
  embed.fields?.push({
   name: lan.scheduledEndTime,
   value: event.client.util.constants.standard.getTime(event.scheduledEndTimestamp),
  });
 }

 if (event.creator || event.creatorId) {
  const creator =
   event.creator ??
   (event.creatorId ? await event.client.util.getUser(event.creatorId) : undefined);

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
  const attachment = event.client.util.txtFileWriter(
   Array.from(users, ([, u]) => u.id).join(', '),
   undefined,
   lan.participants,
  );
  if (attachment) files.push(attachment);
 }

 event.client.util.send({ id: channels, guildId: guild.id }, { embeds: [embed], files }, 10000);
};
