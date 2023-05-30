import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';

export default async (
 msg: Discord.Message,
 channel:
  | Discord.NewsChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel
  | Discord.VoiceChannel,
) => {
 const channels = await ch.getLogChannels('channelevents', channel.guild);
 if (!channels) return;

 const language = await ch.languageSelector(channel.guild.id);
 const lan = language.events.logs.channel;
 const con = ch.constants.events.logs.channel;
 const audit = await ch.getAudit(channel.guild, 75);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.Unpin,
   name: lan.nameUnpin,
  },
  description: auditUser
   ? lan.descPinRemoveAudit(auditUser, msg, language.channelTypes[msg.channel.type])
   : lan.descPinRemove(msg, language.channelTypes[msg.channel.type]),
  fields: [],
  color: ch.constants.colors.success,
  timestamp: new Date().toISOString(),
 };

 ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] }, undefined, 10000);
};
