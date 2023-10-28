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

 const last100 = await ch.request.channels
  .getMessages(channel, { limit: 100 })
  .then((ms) => ('message' in ms ? undefined : ms));
 const language = await ch.getLanguage(channel.guild.id);
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
  timestamp: new Date().toISOString(),
 };

 ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] }, 10000);
};
