import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (
 oldChannel:
  | Discord.CategoryChannel
  | Discord.NewsChannel
  | Discord.StageChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel
  | Discord.VoiceChannel
  | Discord.ForumChannel
  | Discord.AnyThreadChannel
  | Discord.MediaChannel
  | undefined,
 channel:
  | Discord.CategoryChannel
  | Discord.NewsChannel
  | Discord.StageChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel
  | Discord.VoiceChannel
  | Discord.ForumChannel
  | Discord.MediaChannel
  | Discord.AnyThreadChannel,
) => {
 if ('position' in channel && (!oldChannel || 'position' in oldChannel)) {
  if (oldChannel?.position !== channel.position) return;
 }

 const channels = await channel.client.util.getLogChannels('channelevents', channel.guild);
 if (!channels) return;

 const language = await channel.client.util.getLanguage(channel.guild.id);
 const lan = language.events.logs.channel;
 const con = channel.client.util.constants.events.logs.channel;
 const channelType = `${channel.client.util.getTrueChannelType(channel, channel.guild)}Update`;
 let typeId = [10, 11, 12].includes(channel.type) ? 111 : 11;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con[channelType as keyof typeof con],
   name: lan.nameUpdate,
  },
  fields: [],
  color: CT.Colors.Loading,
  timestamp: new Date().toISOString(),
 };

 const embeds = [embed];

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  channel.client.util.mergeLogging(before, after, type, embed, language, name);

 if (oldChannel?.flags !== channel.flags) {
  const [oldFlags, newFlags] = [oldChannel, channel]
   .filter(
    (
     c,
    ): c is
     | Discord.CategoryChannel
     | Discord.NewsChannel
     | Discord.StageChannel
     | Discord.TextChannel
     | Discord.PrivateThreadChannel
     | Discord.PublicThreadChannel
     | Discord.VoiceChannel
     | Discord.ForumChannel
     | Discord.AnyThreadChannel => !!c,
   )
   .map((c) => new Discord.ChannelFlagsBitField(c.flags).toArray());
  const removed = channel.client.util.getDifference(oldFlags, newFlags);
  const added = channel.client.util.getDifference(newFlags, oldFlags);

  if (removed.length || added.length) {
   merge(
    added
     .map(
      (r) =>
       language.events.logs.guild.systemChannelFlags[r as unknown as Discord.ChannelFlagsString],
     )
     .join(', '),
    removed
     .map(
      (r) =>
       language.events.logs.guild.systemChannelFlags[r as unknown as Discord.ChannelFlagsString],
     )
     .join(', '),
    'difference',
    language.t.Flags,
   );
  }
 }

 if (oldChannel?.name !== channel.name) {
  merge(oldChannel?.name ?? language.t.Unknown, channel.name, 'string', language.t.name);
 }

 if (
  (!oldChannel || 'topic' in oldChannel) &&
  'topic' in channel &&
  !!oldChannel?.topic !== !!channel.topic
 ) {
  merge(
   oldChannel?.topic || language.t.None,
   channel.topic || language.t.None,
   'string',
   lan.topic,
  );
 }

 if (
  (!oldChannel || 'bitrate' in oldChannel) &&
  'bitrate' in channel &&
  oldChannel?.bitrate !== channel.bitrate
 ) {
  merge(
   oldChannel ? `${oldChannel?.bitrate}kbps` : language.t.Unknown,
   `${channel.bitrate}kbps`,
   'string',
   lan.bitrate,
  );
 }

 if (
  (!oldChannel || 'nsfw' in oldChannel) &&
  'nsfw' in channel &&
  oldChannel?.nsfw !== channel.nsfw
 ) {
  merge(oldChannel?.nsfw, channel.nsfw, 'boolean', lan.nsfw);
 }

 if (
  (!oldChannel || 'archived' in oldChannel) &&
  'archived' in channel &&
  oldChannel?.archived !== channel.archived
 ) {
  merge(oldChannel?.archived, channel.archived, 'boolean', lan.archived);
 }

 if (
  (!oldChannel || 'locked' in oldChannel) &&
  'locked' in channel &&
  oldChannel?.locked !== channel.locked
 ) {
  merge(oldChannel?.locked, channel.locked, 'boolean', lan.locked);
 }

 if (
  (!oldChannel || 'invitable' in oldChannel) &&
  'invitable' in channel &&
  oldChannel?.invitable !== channel.invitable
 ) {
  merge(oldChannel?.invitable, channel.invitable, 'boolean', lan.invitable);
 }

 if (
  (!oldChannel || 'userLimit' in oldChannel) &&
  'userLimit' in channel &&
  oldChannel?.userLimit !== channel.userLimit
 ) {
  merge(oldChannel?.userLimit, channel.userLimit, 'string', lan.userLimit);
 }

 if (
  (!oldChannel || 'rateLimitPerUser' in oldChannel) &&
  'rateLimitPerUser' in channel &&
  oldChannel?.rateLimitPerUser !== channel.rateLimitPerUser
 ) {
  merge(
   oldChannel?.rateLimitPerUser
    ? channel.client.util.moment(Number(oldChannel?.rateLimitPerUser) * 1000, language)
    : language.t.None,
   channel.rateLimitPerUser
    ? channel.client.util.moment(channel.rateLimitPerUser * 1000, language)
    : language.t.None,
   'string',
   lan.rateLimitPerUser,
  );
 }

 if (
  (!oldChannel || 'rtcRegion' in oldChannel) &&
  'rtcRegion' in channel &&
  oldChannel?.rtcRegion !== channel.rtcRegion
 ) {
  merge(
   oldChannel?.rtcRegion
    ? language.regions[oldChannel.rtcRegion as keyof typeof language.regions]
    : language.t.Unknown,
   channel.rtcRegion
    ? language.regions[channel.rtcRegion as keyof typeof language.regions]
    : language.t.Unknown,
   'string',
   lan.rtcRegion,
  );
 }

 if (
  (!oldChannel || 'videoQualityMode' in oldChannel) &&
  'videoQualityMode' in channel &&
  oldChannel?.videoQualityMode !== channel.videoQualityMode
 ) {
  merge(
   oldChannel?.videoQualityMode
    ? lan.videoQualityMode[oldChannel.videoQualityMode]
    : language.t.Unknown,
   channel.videoQualityMode ? lan.videoQualityMode[channel.videoQualityMode] : language.t.Unknown,
   'string',
   lan.videoQualityModeName,
  );
 }

 if (
  (!oldChannel || 'parentId' in oldChannel) &&
  'parentId' in channel &&
  oldChannel?.parentId !== channel.parentId
 ) {
  const oldParent = oldChannel?.parentId
   ? await channel.client.util.getChannel.parentChannel(oldChannel.parentId)
   : undefined;
  const parent = channel.parentId
   ? await channel.client.util.getChannel.parentChannel(channel.parentId)
   : undefined;

  merge(
   oldParent
    ? language.languageFunction.getChannel(oldParent, language.channelTypes[oldParent.type])
    : language.t.None,
   parent
    ? language.languageFunction.getChannel(parent, language.channelTypes[parent.type])
    : language.t.None,
   'string',
   lan.parentChannel,
  );
 }

 if (
  (!oldChannel || 'archiveTimestamp' in oldChannel) &&
  'archiveTimestamp' in channel &&
  oldChannel?.archiveTimestamp !== channel.archiveTimestamp
 ) {
  merge(
   oldChannel?.archiveTimestamp
    ? `<t:${String(oldChannel.archiveTimestamp).slice(0, -3)}:f>`
    : language.t.Unknown,
   channel.archiveTimestamp
    ? `<t:${String(channel.archiveTimestamp).slice(0, -3)}:f>`
    : language.t.None,
   'string',
   lan.archiveTimestamp,
  );
 }

 if (
  (!oldChannel || 'defaultAutoArchiveDuration' in oldChannel) &&
  'defaultAutoArchiveDuration' in channel &&
  oldChannel?.defaultAutoArchiveDuration !== channel.defaultAutoArchiveDuration
 ) {
  merge(
   oldChannel?.defaultAutoArchiveDuration
    ? channel.client.util.moment(oldChannel.defaultAutoArchiveDuration * 60000, language)
    : language.t.Unknown,
   channel.defaultAutoArchiveDuration
    ? channel.client.util.moment(channel.defaultAutoArchiveDuration * 60000, language)
    : language.t.None,
   'string',
   lan.autoArchiveDuration,
  );
 }

 if (oldChannel?.type !== channel.type) {
  merge(
   oldChannel ? language.channelTypes[oldChannel.type] : language.t.Unknown,
   language.channelTypes[channel.type],
   'string',
   lan.type,
  );
 }

 if (
  (!oldChannel || 'permissionOverwrites' in oldChannel) &&
  'permissionOverwrites' in channel &&
  JSON.stringify(oldChannel?.permissionOverwrites.cache.map((o) => o)) !==
   JSON.stringify(channel.permissionOverwrites.cache.map((o) => o))
 ) {
  const addEmbed: Discord.APIEmbed = {
   color: CT.Colors.Ephemeral,
   fields: [],
  };

  const removeEmbed: Discord.APIEmbed = {
   color: CT.Colors.Ephemeral,
   fields: [],
  };

  const changeEmbed: Discord.APIEmbed = {
   color: CT.Colors.Ephemeral,
   fields: [],
  };

  const oldPerms = oldChannel ? channel.client.util.getSerializedChannelPerms(oldChannel) : [];
  const perms = channel.client.util.getSerializedChannelPerms(channel);

  const addedPerms = perms.filter((p) => !oldPerms.find((p2) => p2.id === p.id));
  const removedPerms = oldPerms.filter((p) => !perms.find((p2) => p2.id === p.id));
  const changedPerms = perms.filter((p) => oldPerms.find((p2) => p2.id === p.id));

  if (addedPerms.length) typeId = 13;
  if (changedPerms.length) typeId = 14;
  if (removedPerms.length) typeId = 15;

  const getEmoji = ({ denied, allowed }: { denied: boolean; allowed: boolean }) => {
   if (denied) {
    return channel.client.util.emotes.switch.disabled
     .map((e) => channel.client.util.constants.standard.getEmote(e))
     .join('');
   }
   if (allowed) {
    return channel.client.util.emotes.switch.enabled
     .map((e) => channel.client.util.constants.standard.getEmote(e))
     .join('');
   }
   return channel.client.util.emotes.switch.neutral
    .map((e) => channel.client.util.constants.standard.getEmote(e))
    .join('');
  };

  let atLeastOneAdded = false;
  addedPerms.forEach((p) => {
   const filterPerms = p.perms.filter((perm) => !perm.neutral);
   const field = embed.fields?.find((f) => f.name === lan.addedPermissionOverwrite);

   if (field) {
    field.value += `, ${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}`;
   } else {
    embed.fields?.push({
     name: lan.addedPermissionOverwrite,
     value: `${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}`,
    });
   }

   if (!filterPerms.length) return;
   atLeastOneAdded = true;

   const value = `${channel.client.util.constants.standard.getEmote(
    channel.client.util.emotes.plusBG,
   )} ${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}\n${filterPerms
    .map((perm) => `${getEmoji(perm)} ${language.permissions.perms[perm.perm]}`)
    .join('\n')}`;

   if (!addEmbed.description?.length) {
    addEmbed.description = value;
   } else {
    addEmbed.fields?.push({
     name: '\u200b',
     value,
     inline: false,
    });
   }
  });

  let atLeastOneChanged = false;
  changedPerms.forEach((p) => {
   const filteredPerms = p.perms.filter(
    (perm) =>
     !oldPerms
      .find((oldPerm) => oldPerm.id === p.id)
      ?.perms.find(
       (oldPerm) =>
        oldPerm.perm === perm.perm &&
        oldPerm.allowed === perm.allowed &&
        oldPerm.denied === perm.denied &&
        oldPerm.neutral === perm.neutral,
      ),
   );
   if (!filteredPerms.length) return;

   const field = embed.fields?.find((f) => f.name === lan.changedPermissionOverwrite);
   if (field) {
    field.value += `, ${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}`;
   } else {
    embed.fields?.push({
     name: lan.changedPermissionOverwrite,
     value: `${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}`,
    });
   }

   atLeastOneChanged = true;

   const value = `${channel.client.util.constants.standard.getEmote(
    channel.client.util.emotes.edit,
   )} ${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}\n${filteredPerms
    .map((perm) => `${getEmoji(perm)} ${language.permissions.perms[perm.perm]}`)
    .join('\n')}`;

   if (!changeEmbed.description?.length) {
    changeEmbed.description = value;
   } else {
    changeEmbed.fields?.push({
     name: '\u200b',
     value,
     inline: false,
    });
   }
  });

  let atLeastOneRemoved = false;
  removedPerms.forEach((p) => {
   const filterPerms = p.perms.filter((perm) => !perm.neutral);
   const field = embed.fields?.find((f) => f.name === lan.removedPermissionOverwrite);

   if (field) {
    field.value += `, ${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}`;
   } else {
    embed.fields?.push({
     name: lan.removedPermissionOverwrite,
     value: `${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}`,
    });
   }

   if (!filterPerms.length) return;
   atLeastOneRemoved = true;

   const value = `${channel.client.util.constants.standard.getEmote(
    channel.client.util.emotes.minusBG,
   )} ${p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`}\n${filterPerms
    .map((perm) => `${getEmoji(perm)} ${language.permissions.perms[perm.perm]}`)
    .join('\n')}`;

   if (!removeEmbed.description?.length) {
    removeEmbed.description = value;
   } else {
    removeEmbed.fields?.push({
     name: '\u200b',
     value,
     inline: false,
    });
   }
  });

  if (atLeastOneAdded) embeds.push(addEmbed);
  if (atLeastOneChanged) embeds.push(changeEmbed);
  if (atLeastOneRemoved) embeds.push(removeEmbed);
 }

 const audit = await channel.client.util.getAudit(channel.guild, typeId, channel.id);
 const getChannelOwner = () => {
  if (audit?.executor) return audit.executor;
  if ('ownerId' in channel && channel.ownerId) {
   return channel.client.util.getUser(channel.ownerId).catch(() => undefined);
  }
  return undefined;
 };
 const auditUser = await getChannelOwner();

 embed.description = auditUser
  ? lan.descUpdateAudit(auditUser, channel, language.channelTypes[channel.type])
  : lan.descUpdate(channel, language.channelTypes[channel.type]);

 channel.client.util.send({ id: channels, guildId: channel.guild.id }, { embeds }, 10000);
};
