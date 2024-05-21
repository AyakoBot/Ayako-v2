import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (
 added: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 removed: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
 thread: Discord.ThreadChannel,
) => {
 const channels = await thread.client.util.getLogChannels('channelevents', thread.guild);
 if (!channels) return;

 const language = await thread.client.util.getLanguage(thread.guild.id);
 const lan = language.events.logs.channel;
 const con = thread.client.util.constants.events.logs.threadMembers;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: '-',
   icon_url: con.update,
  },
  fields: [],
  color: CT.Colors.Loading,
  timestamp: new Date().toISOString(),
 };

 if (added?.size) {
  const userMentions = added.map((m) => `<@${m.id}>`).join(', ');

  if (userMentions.length > 1024) {
   const content = thread.client.util.txtFileWriter(userMentions, undefined, language.t.Added);
   if (content) files.push(content);
  } else embed.fields?.push({ name: lan.join, value: userMentions });

  embed.description = lan.descJoinMember(thread, language.channelTypes[thread.type]);
  embed.author!.name = lan.nameJoin;
 }

 if (removed?.size) {
  const userMentions = removed.map((m) => `<@${m.id}>`).join(', ');

  if (userMentions.length > 1024) {
   const content = thread.client.util.txtFileWriter(userMentions, undefined, language.t.Added);
   if (content) files.push(content);
  } else {
   embed.fields?.push({
    name: lan.left,
    value: userMentions,
   });
  }

  embed.description = lan.descLeaveMember(thread, language.channelTypes[thread.type]);
  embed.author!.name = lan.nameLeave;
 }

 thread.client.util.send(
  { id: channels, guildId: thread.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
