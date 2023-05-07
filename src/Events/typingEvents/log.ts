import type * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (typing: Discord.Typing) => {
 if (!typing.inGuild()) return;

 const channels = await ch.getLogChannels('typingevents', typing.guild);
 if (!channels) return;

 const user = await typing.user.fetch();
 const language = await ch.languageSelector(typing.guild.id);
 const lan = language.events.logs.channel;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameTyping,
  },
  description: lan.descTyping(user, typing.channel, language.channelTypes[typing.channel.type]),
  fields: [],
  color: ch.constants.colors.loading,
 };

 ch.send({ id: channels, guildId: typing.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
