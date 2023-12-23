import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 added: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 removed: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 thread: Discord.ThreadChannel,
) => {
 const channels = await ch.getLogChannels('channelevents', thread.guild);
 if (!channels) return;

 const language = await ch.getLanguage(thread.guild.id);
 const lan = language.events.logs.channel;
 const con = ch.constants.events.logs.threadMembers;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameJoin,
   icon_url: con.update,
  },
  fields: [],
  color: CT.Colors.Loading,
  timestamp: new Date().toISOString(),
 };

 if (added?.size) {
  const userMentions = added.map((m) => `<@${m.id}>`).join(', ');

  if (userMentions.length > 1024) {
   const content = ch.txtFileWriter(userMentions, undefined, language.t.Added);
   if (content) files.push(content);
  } else {
   embed.fields?.push({
    name: lan.join,
    value: userMentions,
   });
  }

  embed.description = lan.descJoinMember(thread, language.channelTypes[thread.type]);
 }

 if (removed?.size) {
  const userMentions = removed.map((m) => `<@${m.id}>`).join(', ');

  if (userMentions.length > 1024) {
   const content = ch.txtFileWriter(userMentions, undefined, language.t.Added);
   if (content) files.push(content);
  } else {
   embed.fields?.push({
    name: lan.left,
    value: userMentions,
   });
  }

  embed.description = lan.descLeaveMember(thread, language.channelTypes[thread.type]);
 }

 ch.send({ id: channels, guildId: thread.guild.id }, { embeds: [embed], files }, 10000);
};
