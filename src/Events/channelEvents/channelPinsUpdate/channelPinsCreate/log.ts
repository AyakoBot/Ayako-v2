import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

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
 const channels = await ch.getLogChannels('channelevents', channel.guild);
 if (!channels) return;

 const last100 = await channel.messages.fetch({ limit: 100 }).catch(() => undefined);
 const language = await ch.languageSelector(channel.guild.id);
 const lan = language.events.logs.channel;
 const con = ch.constants.events.logs.channel;
 const audit = await ch.getAudit(channel.guild, 74);
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
  color: ch.constants.colors.success,
 };

 ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] }, undefined, 10000);
};
