import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings';

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
  | Discord.AnyThreadChannel,
) => {
 const channels = await ch.getLogChannels('channelevents', channel.guild);
 if (!channels) return;

 const language = await ch.languageSelector(channel.guild.id);
 const lan = language.events.logs.channel;
 const con = ch.constants.events.logs.channel;
 const channelType = `${ch.getTrueChannelType(channel, channel.guild)}Update`;
 let typeID = [10, 11, 12].includes(channel.type) ? 111 : 11;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con[channelType as keyof typeof con],
   name: lan.nameUpdate,
  },
  fields: [],
  color: ch.constants.colors.loading,
  timestamp: new Date().toISOString(),
 };

 const embeds = [embed];

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  ch.mergeLogging(before, after, type, embed, language, name);

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
  const removed = ch.getDifference(oldFlags, newFlags);
  const added = ch.getDifference(newFlags, oldFlags);

  if (removed.length || added.length) {
   merge(
    added.map((r) => lan.flags[r as unknown as Discord.ChannelFlagsString]).join(', '),
    removed.map((r) => lan.flags[r as unknown as Discord.ChannelFlagsString]).join(', '),
    'difference',
    language.Flags,
   );
  }
 }

 if (oldChannel?.name !== channel.name) {
  merge(oldChannel?.name ?? language.unknown, channel.name, 'string', language.name);
 }

 if (
  (!oldChannel || 'topic' in oldChannel) &&
  'topic' in channel &&
  !!oldChannel?.topic !== !!channel.topic
 ) {
  merge(oldChannel?.topic || language.None, channel.topic || language.None, 'string', lan.topic);
 }

 if (
  (!oldChannel || 'bitrate' in oldChannel) &&
  'bitrate' in channel &&
  oldChannel?.bitrate !== channel.bitrate
 ) {
  merge(
   oldChannel ? `${oldChannel?.bitrate}kbps` : language.unknown,
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
    ? ch.moment(Number(oldChannel?.rateLimitPerUser) * 1000, language)
    : language.None,
   channel.rateLimitPerUser ? ch.moment(channel.rateLimitPerUser * 1000, language) : language.None,
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
    : language.unknown,
   channel.rtcRegion
    ? language.regions[channel.rtcRegion as keyof typeof language.regions]
    : language.unknown,
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
    : language.unknown,
   channel.videoQualityMode ? lan.videoQualityMode[channel.videoQualityMode] : language.unknown,
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
   ? await ch.getChannel.parentChannel(oldChannel.parentId)
   : undefined;
  const parent = channel.parentId ? await ch.getChannel.parentChannel(channel.parentId) : undefined;

  merge(
   oldParent
    ? language.languageFunction.getChannel(oldParent, language.channelTypes[oldParent.type])
    : language.None,
   parent
    ? language.languageFunction.getChannel(parent, language.channelTypes[parent.type])
    : language.None,
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
    : language.unknown,
   channel.archiveTimestamp
    ? `<t:${String(channel.archiveTimestamp).slice(0, -3)}:f>`
    : language.None,
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
    ? ch.moment(oldChannel.defaultAutoArchiveDuration * 60000, language)
    : language.unknown,
   channel.defaultAutoArchiveDuration
    ? ch.moment(channel.defaultAutoArchiveDuration * 60000, language)
    : language.None,
   'string',
   lan.autoArchiveDuration,
  );
 }

 if (oldChannel?.type !== channel.type) {
  merge(
   oldChannel ? language.channelTypes[oldChannel.type] : language.unknown,
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
   color: ch.constants.colors.ephemeral,
   fields: [],
  };

  const removeEmbed: Discord.APIEmbed = {
   color: ch.constants.colors.ephemeral,
   fields: [],
  };

  const changeEmbed: Discord.APIEmbed = {
   color: ch.constants.colors.ephemeral,
   fields: [],
  };

  const oldPerms = oldChannel ? ch.getSerializedChannelPerms(oldChannel) : [];
  const perms = ch.getSerializedChannelPerms(channel);

  const addedPerms = perms.filter((p) => !oldPerms.find((p2) => p2.id === p.id));
  const removedPerms = oldPerms.filter((p) => !perms.find((p2) => p2.id === p.id));
  const changedPerms = perms.filter((p) => oldPerms.find((p2) => p2.id === p.id));

  if (addedPerms.length) typeID = 13;
  if (changedPerms.length) typeID = 14;
  if (removedPerms.length) typeID = 15;

  const getEmoji = ({ denied, allowed }: { denied: boolean; allowed: boolean }) => {
   if (denied) return ch.stringEmotes.switch.disable;
   if (allowed) return ch.stringEmotes.switch.enable;
   return ch.stringEmotes.switch.neutral;
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

   addEmbed.fields?.push({
    name: '\u200b',
    value: `${ch.stringEmotes.plusBG} ${
     p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`
    }\n${filterPerms
     .map((perm) => `${getEmoji(perm)} ${language.permissions.perms[perm.perm]}`)
     .join('\n')}`,
    inline: false,
   });
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

   changeEmbed.fields?.push({
    name: '\u200b',
    value: `${ch.stringEmotes.edit} ${
     p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`
    }\n${filteredPerms
     .map((perm) => `${getEmoji(perm)} ${language.permissions.perms[perm.perm]}`)
     .join('\n')}`,
    inline: false,
   });
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

   removeEmbed.fields?.push({
    name: '\u200b',
    value: `${ch.stringEmotes.minusBG} ${
     p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`
    }\n${filterPerms
     .map((perm) => `${getEmoji(perm)} ${language.permissions.perms[perm.perm]}`)
     .join('\n')}`,
    inline: false,
   });
  });

  if (atLeastOneAdded) embeds.push(addEmbed);
  if (atLeastOneChanged) embeds.push(changeEmbed);
  if (atLeastOneRemoved) embeds.push(removeEmbed);
 }

 const audit = await ch.getAudit(channel.guild, typeID, channel.id);
 const getChannelOwner = () => {
  if (audit?.executor) return audit.executor;
  if ('ownerId' in channel && channel.ownerId) {
   return ch.getUser(channel.ownerId).catch(() => undefined);
  }
  return undefined;
 };
 const auditUser = await getChannelOwner();

 embed.description = auditUser
  ? lan.descUpdateAudit(auditUser, channel, language.channelTypes[channel.type])
  : lan.descUpdate(channel, language.channelTypes[channel.type]);

 ch.send({ id: channels, guildId: channel.guild.id }, { embeds }, undefined, 10000);
};
