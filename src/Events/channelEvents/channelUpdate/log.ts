import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
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
    | undefined,
  channel:
    | Discord.CategoryChannel
    | Discord.NewsChannel
    | Discord.StageChannel
    | Discord.TextChannel
    | Discord.PrivateThreadChannel
    | Discord.PublicThreadChannel
    | Discord.VoiceChannel
    | Discord.ForumChannel,
) => {
  const channels = await client.ch.getLogChannels('channelevents', channel.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const channelType = `${client.ch.getTrueChannelType(channel, channel.guild)}Update`;
  let typeID = [10, 11, 12].includes(channel.type) ? 111 : 11;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con[channelType as keyof typeof con],
      name: lan.nameUpdate,
    },
    fields: [],
    color: client.customConstants.colors.success,
  };

  const embeds = [embed];

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

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
          | Discord.ForumChannel => !!c,
      )
      .map((c) => new Discord.ChannelFlagsBitField(c.flags).toArray());
    const removed = client.ch.getDifference(oldFlags, newFlags) as ('Pinned' | 'RequireTag')[];
    const added = client.ch.getDifference(newFlags, oldFlags) as ('Pinned' | 'RequireTag')[];

    merge(
      added.map((r) => lan.flags[r]).join(', '),
      removed.map((r) => lan.flags[r]).join(', '),
      'difference',
      language.Flags,
    );
  }

  if (oldChannel?.name !== channel.name) {
    merge(oldChannel?.name ?? language.unknown, channel.name, 'string', language.name);
  }

  if (
    (!oldChannel || 'topic' in oldChannel) &&
    'topic' in channel &&
    oldChannel?.topic !== channel.topic
  ) {
    merge(oldChannel?.topic ?? language.unknown, channel.topic, 'string', lan.topic);
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
      client.ch.moment(oldChannel?.rateLimitPerUser || 0, language),
      client.ch.moment(channel.rateLimitPerUser || 0, language),
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
      ? await client.ch.getChannel.parentChannel(oldChannel.parentId)
      : undefined;
    const parent = channel.parentId
      ? await client.ch.getChannel.parentChannel(channel.parentId)
      : undefined;

    merge(
      oldParent
        ? language.languageFunction.getChannel(oldParent, language.channelTypes[oldParent.type])
        : language.none,
      parent
        ? language.languageFunction.getChannel(parent, language.channelTypes[parent.type])
        : language.none,
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
        : language.none,
      'string',
      lan.archiveTimestamp,
    );
  }

  if (
    (!oldChannel || 'autoArchiveDuration' in oldChannel) &&
    'autoArchiveDuration' in channel &&
    oldChannel?.autoArchiveDuration !== channel.autoArchiveDuration
  ) {
    merge(
      oldChannel?.autoArchiveDuration
        ? `<t:${String(oldChannel.autoArchiveDuration).slice(0, -3)}:f>`
        : language.unknown,
      channel.autoArchiveDuration
        ? `<t:${String(channel.autoArchiveDuration).slice(0, -3)}:f>`
        : language.none,
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
    JSON.stringify(oldChannel?.permissionOverwrites) !==
      JSON.stringify(channel.permissionOverwrites)
  ) {
    const permEmbed: Discord.APIEmbed = {
      color: client.customConstants.colors.loading,
      fields: [],
    };
    embeds.push(permEmbed);

    const addedPermissions = channel.permissionOverwrites.cache.filter(
      (c) => !oldChannel?.permissionOverwrites.cache.has(c.id),
    );
    const removedPermissions = oldChannel?.permissionOverwrites.cache.filter(
      (c) => !channel.permissionOverwrites.cache.has(c.id),
    );
    const changedPermissions = oldChannel?.permissionOverwrites.cache.size
      ? oldChannel?.permissionOverwrites.cache.filter(
          (e) =>
            JSON.stringify(e) !==
              JSON.stringify(
                channel?.permissionOverwrites.cache.find((c) => c.id === e.id) ?? undefined,
              ) && channel?.permissionOverwrites.cache.find((c) => c.id === e.id),
        )
      : channel?.permissionOverwrites.cache.filter(
          (e) =>
            JSON.stringify(e) !==
              JSON.stringify(
                oldChannel?.permissionOverwrites.cache.find((c) => c.id === e.id) ?? undefined,
              ) && oldChannel?.permissionOverwrites.cache.find((c) => c.id === e.id),
        );

    if (addedPermissions.size) typeID = 13;
    addedPermissions.forEach((p) =>
      permEmbed.fields?.push({
        name: `\u200b`,
        value: [
          `${client.stringEmotes.plusBG} ${
            p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`
          }`,
          Object.entries(p.allow.serialize())
            .filter(([, a]) => !!a)
            .map(
              (a) =>
                `${client.stringEmotes.switch.enable} ${
                  language.permissions.perms[
                    a as unknown as keyof typeof language.permissions.perms
                  ]
                }`,
            ),
        ].join('\n'),
      }),
    );

    if (removedPermissions?.size) typeID = 15;
    removedPermissions?.forEach((p) =>
      permEmbed.fields?.push({
        name: `\u200b`,
        value: [
          `${client.stringEmotes.minusBG} ${
            p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`
          }`,
          Object.entries(p.allow.serialize())
            .filter(([, a]) => !!a)
            .map(
              (a) =>
                `${client.stringEmotes.switch.disable} ${
                  language.permissions.perms[
                    a as unknown as keyof typeof language.permissions.perms
                  ]
                }`,
            ),
        ].join('\n'),
      }),
    );

    if (removedPermissions?.size) typeID = 14;
    changedPermissions.forEach((p) => {
      permEmbed.fields?.push({
        name: `\u200b`,
        value: [
          `${client.stringEmotes.edit} ${
            p.type === Discord.OverwriteType.Member ? `<@${p.id}>` : `<@&${p.id}>`
          }\n`,
          ...client.ch.makePermissionsStrings(p, oldChannel, channel, language),
        ].join('\n'),
      });
    });
  }

  const audit = await client.ch.getAudit(channel.guild, typeID, channel.id);
  const getChannelOwner = () => {
    if (audit?.executor) return audit.executor;
    if ('ownerId' in channel && channel.ownerId) {
      return client.users.fetch(channel.ownerId).catch(() => undefined);
    }
    return undefined;
  };
  const auditUser = await getChannelOwner();

  embed.description = auditUser
    ? lan.descUpdateAudit(auditUser, channel, language.channelTypes[channel.type])
    : lan.descUpdate(channel, language.channelTypes[channel.type]);

  client.ch.send(
    { id: channels, guildId: channel.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
