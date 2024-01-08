import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (reaction: Discord.MessageReaction, msg: Discord.Message<true>) => {
 if (!msg.inGuild()) return;

 const channels = await reaction.client.util.getLogChannels('messageevents', msg.guild);
 if (!channels) return;

 const language = await reaction.client.util.getLanguage(msg.guildId);
 const lan = language.events.logs.reaction;
 const con = reaction.client.util.constants.events.logs.reaction;
 const files: Discord.AttachmentPayload[] = [];
 if (!msg) return;

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameRemoveEmoji,
   icon_url: con.remove,
   url: reaction.client.util.constants.standard.msgurl(msg.guildId, msg.channelId, msg.id),
  },
  description: lan.descRemoveEmoji(msg, reaction.emoji),
  color: CT.Colors.Danger,
  fields: [],
  timestamp: new Date().toISOString(),
 };

 if (reaction.emoji.url) {
  embed.thumbnail = {
   url: `attachment://${reaction.client.util.getNameAndFileType(reaction.emoji.url)}`,
  };

  const attachment = (await reaction.client.util.fileURL2Buffer([reaction.emoji.url]))?.[0];
  if (attachment) files.push(attachment);
 }

 if (reaction.users.cache.size) {
  embed.fields?.push({
   name: lan.count,
   value: String(reaction.count),
  });

  const users = reaction.client.util.txtFileWriter(
   reaction.users.cache.map((r) => r.id).join(', '),
   undefined,
   lan.reactions,
  );

  if (users) files.push(users);
 }

 await reaction.client.util.send(
  { id: channels, guildId: msg.guildId },
  { embeds: [embed], files },
  10000,
 );
};
