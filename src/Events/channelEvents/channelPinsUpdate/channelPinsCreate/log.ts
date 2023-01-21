import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (
  msg: Discord.Message,
  channel:
    | Discord.NewsChannel
    | Discord.TextChannel
    | Discord.PrivateThreadChannel
    | Discord.PublicThreadChannel
    | Discord.VoiceChannel,
  date: Date,
) => {
  const channels = await client.ch.getLogChannels('channelevents', channel.guild);
  if (!channels) return;

  const last100 = await channel.messages.fetch({ limit: 100 }).catch(() => undefined);
  const language = await client.ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(channel.guild, 74);
  const auditUser =
    audit?.executor ??
    last100?.find(
      (m) =>
        m.type === Discord.MessageType.ChannelPinnedMessage &&
        m.createdTimestamp < date.getTime() + 5000 &&
        m.createdTimestamp > date.getTime() - 5000,
    )?.author;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.Pin,
      name: lan.namePin,
    },
    description: auditUser
      ? lan.descPinCreateAudit(auditUser, msg, language.channelTypes[msg.channel.type])
      : lan.descPinCreate(msg, language.channelTypes[msg.channel.type]),
    fields: [],
    color: client.customConstants.colors.success,
  };

  client.ch.send(
    { id: channels, guildId: channel.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
