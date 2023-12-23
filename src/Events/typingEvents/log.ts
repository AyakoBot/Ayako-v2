import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import * as CT from '../../Typings/Typings.js';

export default async (typing: Discord.Typing) => {
 if (!typing.inGuild()) return;

 const channels = await ch.getLogChannels('typingevents', typing.guild);
 if (!channels) return;

 const user = await ch.getUser(typing.user.id);
 if (!user) return;

 const language = await ch.getLanguage(typing.guild.id);
 const lan = language.events.logs.channel;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameTyping,
  },
  description: lan.descTyping(user, typing.channel, language.channelTypes[typing.channel.type]),
  fields: [],
  color: CT.Colors.Loading,
  timestamp: new Date().toISOString(),
 };

 ch.send({ id: channels, guildId: typing.guild.id }, { embeds: [embed], files }, 10000);
};
