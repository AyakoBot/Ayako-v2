import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

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

 const channels = await ch.getLogChannels('channelevents', channel.guild);
 if (!channels) return;

 const language = await ch.languageSelector(channel.guild.id);
 const lan = language.events.logs.channel;
 const con = ch.constants.events.logs.channel;
 const audit = await ch.getAudit(
  channel.guild,
  [10, 11, 12].includes(channel.type) ? 112 : 12,
  channel.id,
 );
 const channelType = `${ch.getTrueChannelType(channel, channel.guild)}Delete`;
 const getChannelOwner = () => {
  if (audit?.executor) return audit.executor;
  if ('ownerId' in channel && channel.ownerId) {
   return ch.getUser(channel.ownerId).catch(() => undefined);
  }
  return undefined;
 };
 const auditUser = await getChannelOwner();

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con[channelType as keyof typeof con],
   name: lan.nameDelete,
  },
  description: auditUser
   ? lan.descDeleteAudit(auditUser, channel, language.channelTypes[channel.type])
   : lan.descDelete(channel, language.channelTypes[channel.type]),
  fields: [],
  color: ch.constants.colors.danger,
  timestamp: new Date().toISOString(),
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

 if (flagsText?.length) {
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
   value: ch.moment(channel.rateLimitPerUser, language),
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

 if ('nsfw' in channel && channel.parentId) {
  const parent = channel.parentId ? await ch.getChannel.parentChannel(channel.parentId) : undefined;

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
   value: ch.moment(channel.autoArchiveDuration * 60000, language),
   inline: true,
  });
 }

 if ('permissionOverwrites' in channel) {
  const permEmbed: Discord.APIEmbed = {
   color: ch.constants.colors.ephemeral,
   description: channel.permissionOverwrites.cache
    .map(
     (perm) =>
      `${
       perm.type === Discord.OverwriteType.Member ? `<@${perm.id}>` : `<@&${perm.id}>`
      }\n${Object.entries(new Discord.PermissionsBitField(perm.allow.bitfield).serialize())
       .filter(([, a]) => !!a)
       .map(
        (permissionString) =>
         `${ch.stringEmotes.enabled} \`${
          language.permissions.perms[permissionString[0] as keyof typeof language.permissions.perms]
         }\``,
       )
       .join('\n')}\n${Object.entries(
       new Discord.PermissionsBitField(perm.deny.bitfield).serialize(),
      )
       .filter(([, a]) => !!a)
       .map(
        (permissionString) =>
         `${ch.stringEmotes.disabled} \`${
          language.permissions.perms[permissionString[0] as keyof typeof language.permissions.perms]
         }\``,
       )
       .join('\n')}`,
    )
    .join('\n\n'),
  };

  embeds.push(permEmbed);
 }

 ch.send({ id: channels, guildId: channel.guild.id }, { embeds }, undefined, 10000);
};
