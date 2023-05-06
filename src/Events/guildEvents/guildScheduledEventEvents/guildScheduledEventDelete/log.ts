import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import client from '../../../../BaseClient/Client.js';

export default async (
 event: Discord.GuildScheduledEvent,
 users: Map<string, Discord.User> | undefined,
) => {
 const guild = event.guild ?? client.guilds.cache.get(event.guildId);
 if (!guild) return;

 const channels = await ch.getLogChannels('scheduledeventevents', guild);
 if (!channels) return;

 const channel =
  event.channel ??
  (event.channelId
   ? (await ch.getChannel.guildTextChannel(event.channelId)) ??
     (await ch.getChannel.guildVoiceChannel(event.channelId))
   : undefined);
 const language = await ch.languageSelector(guild.id);
 const lan = language.events.logs.scheduledEvent;
 const con = ch.constants.events.logs.guild;
 const audit = await ch.getAudit(guild, 102, event.id);
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
  color: ch.constants.colors.danger,
  fields: [],
  description,
 };

 if (event.image) {
  const getImage = async () => {
   const url = event.coverImageURL({ size: 4096 });
   if (!url) return;

   embed.image = {
    url: `attachment://${ch.getNameAndFileType(url)}`,
   };

   const attachment = (await ch.fileURL2Buffer([url])).filter(
    (e): e is Discord.AttachmentPayload => !!e,
   );
   if (attachment) files.push(...attachment);
  };

  await getImage();
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
   value: ch.constants.standard.getTime(event.scheduledStartTimestamp),
  });
 }

 if (event.scheduledEndTimestamp) {
  embed.fields?.push({
   name: lan.scheduledEndTime,
   value: ch.constants.standard.getTime(event.scheduledEndTimestamp),
  });
 }

 if (event.creator || event.creatorId) {
  const creator =
   event.creator ?? (event.creatorId ? await ch.getUser(event.creatorId) : undefined);

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
  const attachment = ch.txtFileWriter(
   Array.from(users, ([, u]) => u.id).join(', '),
   undefined,
   lan.participants,
  );
  if (attachment) files.push(attachment);
 }

 ch.send({ id: channels, guildId: guild.id }, { embeds: [embed], files }, undefined, 10000);
};
