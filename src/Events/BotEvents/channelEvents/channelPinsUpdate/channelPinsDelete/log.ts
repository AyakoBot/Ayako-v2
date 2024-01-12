import type * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default async (
 msg: Discord.Message,
 channel:
  | Discord.NewsChannel
  | Discord.TextChannel
  | Discord.PrivateThreadChannel
  | Discord.PublicThreadChannel
  | Discord.VoiceChannel,
) => {
 const channels = await channel.client.util.getLogChannels('channelevents', channel.guild);
 if (!channels) return;

 const language = await channel.client.util.getLanguage(channel.guild.id);
 const lan = language.events.logs.channel;
 const con = channel.client.util.constants.events.logs.channel;
 const audit = await channel.client.util.getAudit(channel.guild, 75);
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
  color: CT.Colors.Danger,
  timestamp: new Date().toISOString(),
 };

 channel.client.util.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed] }, 10000);
};
