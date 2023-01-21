import * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
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
  if (!channel.guild.id) return;

  const channels = await client.ch.getLogChannels('channelevents', channel.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(
    channel.guild,
    [10, 11, 12].includes(channel.type) ? 110 : 10,
    channel.id,
  );
  const channelType = `${client.ch.getTrueChannelType(channel, channel.guild)}Create`;
  const getChannelOwner = () => {
    if (audit?.executor) return audit.executor;
    if ('ownerId' in channel && channel.ownerId) {
      return client.users.fetch(channel.ownerId).catch(() => undefined);
    }
    return undefined;
  };
  const auditUser = await getChannelOwner();

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con[channelType as keyof typeof con],
      name: lan.nameCreate,
    },
    description: auditUser
      ? lan.descCreateAudit(auditUser, channel, language.channelTypes[channel.type])
      : lan.descCreate(channel, language.channelTypes[channel.type]),
    fields: [],
    color: client.customConstants.colors.success,
  };

  const embeds = [embed];

  const flags = new Discord.ChannelFlagsBitField(channel.flags || 0).toArray();

  const flagsText = [
    ...flags.map((f) => lan.flags[f]),
    'nsfw' in channel && channel.nsfw ? lan.nsfw : null,
    'archived' in channel && channel.archived ? lan.archived : null,
    'locked' in channel && channel.locked ? lan.locked : null,
    'invitable' in channel && channel.invitable ? lan.invitable : null,
    'newlyCreated' in channel && channel.newlyCreated ? lan.newlyCreated : null,
  ]
    .filter((f): f is string => !!f)
    .map((f) => `\`${f}\``)
    .join(', ');

  if (flagsText) {
    embed.fields?.push({
      name: language.Flags,
      value: flagsText,
      inline: true,
    });
  }

  if ('topic' in channel && channel.topic) {
    embed.fields?.push({ name: lan.topic, value: channel.topic, inline: true });
  }

  if ('bitrate' in channel && channel.bitrate) {
    embed.fields?.push({ name: lan.bitrate, value: `${channel.bitrate}kbps`, inline: true });
  }

  if ('userLimit' in channel && channel.userLimit) {
    embed.fields?.push({ name: lan.userLimit, value: String(channel.userLimit), inline: true });
  }

  if ('rateLimitPerUser' in channel && channel.rateLimitPerUser) {
    embed.fields?.push({
      name: lan.rateLimitPerUser,
      value: client.ch.moment(channel.rateLimitPerUser, language),
      inline: true,
    });
  }

  if ('rtcRegion' in channel && channel.rtcRegion) {
    embed.fields?.push({
      name: lan.rtcRegion,
      value: language.regions[channel.rtcRegion as keyof typeof language.regions],
      inline: true,
    });
  }

  if ('videoQualityMode' in channel && channel.videoQualityMode) {
    embed.fields?.push({
      name: lan.videoQualityModeName,
      value: lan.videoQualityMode[channel.videoQualityMode],
      inline: true,
    });
  }

  if (channel.parentId) {
    const parent = channel.parentId
      ? await client.ch.getChannel.parentChannel(channel.parentId)
      : undefined;

    if (parent) {
      embed.fields?.push({
        name: lan.parentChannel,
        value: language.languageFunction.getChannel(parent, language.channelTypes[4]),
        inline: true,
      });
    }
  }

  if ('autoArchiveDuration' in channel && channel.autoArchiveDuration) {
    embed.fields?.push({
      name: lan.autoArchiveDuration,
      value: client.ch.moment(channel.autoArchiveDuration, language),
      inline: true,
    });
  }

  if ('permissionOverwrites' in channel) {
    const permEmbed: Discord.APIEmbed = {
      color: client.customConstants.colors.ephemeral,
      description: channel.permissionOverwrites.cache
        .map(
          (perm) =>
            `${
              perm.type === Discord.OverwriteType.Member ? `<@${perm.id}>` : `<@&${perm.id}>`
            }\n${Object.entries(new Discord.PermissionsBitField(perm.allow.bitfield).serialize())
              .filter(([, a]) => !!a)
              .map(
                (permissionString) =>
                  `${client.stringEmotes.enabled} \`${
                    language.permissions.perms[
                      permissionString[0] as keyof typeof language.permissions.perms
                    ]
                  }\``,
              )
              .join('\n')}\n${Object.entries(
              new Discord.PermissionsBitField(perm.deny.bitfield).serialize(),
            )
              .filter(([, a]) => !!a)
              .map(
                (permissionString) =>
                  `${client.stringEmotes.disabled} \`${
                    language.permissions.perms[
                      permissionString[0] as keyof typeof language.permissions.perms
                    ]
                  }\``,
              )
              .join('\n')}`,
        )
        .join('\n\n'),
    };

    embeds.push(permEmbed);
  }

  client.ch.send(
    { id: channels, guildId: channel.guild.id },
    { embeds },
    language,
    undefined,
    10000,
  );
};
