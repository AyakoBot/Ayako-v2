import * as Discord from 'discord.js';
import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (channel: DDeno.Channel) => {
  if (!channel.guildId) return;

  const channels = await client.ch.getLogChannels('channelevents', channel);
  if (!channels) return;

  const guild = await client.cache.guilds.get(channel.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(channel.guildId);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(guild, 12, channel.id);
  const channelType = `${client.ch.getTrueChannelType(channel, guild)}Delete`;
  const auditUser = await client.ch.getChannelOwner(channel, audit);

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con[channelType as keyof typeof con],
      name: lan.nameDelete,
    },
    description: auditUser
      ? lan.descDeleteAudit(auditUser, channel, language.channelTypes[channel.type])
      : lan.descDelete(channel, language.channelTypes[channel.type]),
    fields: [],
    color: client.customConstants.colors.success,
  };

  const flags = new Discord.ChannelFlagsBitField(channel.flags || 0).toArray();

  embed.fields?.push({
    name: lan.flagsName,
    value: [
      ...flags.map((f) => lan.flags[f]),
      channel.nsfw ? lan.nsfw : null,
      channel.archived ? lan.archived : null,
      channel.locked ? lan.locked : null,
      channel.invitable ? lan.invitable : null,
      channel.newlyCreated ? lan.newlyCreated : null,
    ]
      .filter((f): f is string => !!f)
      .map((f) => `\`${f}\``)
      .join(', '),
    inline: true,
  });

  if (channel.topic) {
    embed.fields?.push({ name: lan.topic, value: channel.topic, inline: true });
  }

  if (channel.bitrate) {
    embed.fields?.push({ name: lan.bitrate, value: `${channel.bitrate}kbps`, inline: true });
  }

  if (channel.userLimit) {
    embed.fields?.push({ name: lan.userLimit, value: String(channel.userLimit), inline: true });
  }

  if (channel.rateLimitPerUser) {
    embed.fields?.push({
      name: lan.rateLimitPerUser,
      value: client.ch.moment(channel.rateLimitPerUser, language),
      inline: true,
    });
  }

  if (channel.rtcRegion) {
    embed.fields?.push({
      name: lan.rtcRegion,
      value: language.regions[channel.rtcRegion as keyof typeof language.regions],
      inline: true,
    });
  }

  if (channel.videoQualityMode) {
    embed.fields?.push({
      name: lan.videoQualityMode[0],
      value: lan.videoQualityMode[channel.videoQualityMode],
      inline: true,
    });
  }

  if (channel.videoQualityMode) {
    embed.fields?.push({
      name: lan.videoQualityMode[0],
      value: lan.videoQualityMode[channel.videoQualityMode],
      inline: true,
    });
  }

  if (channel.parentId) {
    const parent = await client.cache.channels.get(channel.parentId);

    if (parent) {
      embed.fields?.push({
        name: lan.parentChannel,
        value: language.languageFunction.getChannel(parent, language.channelTypes[4]),
        inline: true,
      });
    }
  }

  if (channel.autoArchiveDuration) {
    embed.fields?.push({
      name: lan.autoArchiveDuration,
      value: client.ch.moment(channel.autoArchiveDuration, language),
      inline: true,
    });
  }

  const oldChannel = { ...channel };
  oldChannel.permissionOverwrites = [];

  (client.events.channelUpdate as CT.ChannelUpdate)(client, channel, oldChannel);

  client.ch.send(
    { id: channels, guildId: channel.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
