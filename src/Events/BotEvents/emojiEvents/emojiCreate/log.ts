import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (emote: Discord.GuildEmoji) => {
 const channels = await emote.client.util.getLogChannels('emojievents', emote.guild);
 if (!channels) return;

 const language = await emote.client.util.getLanguage(emote.guild.id);
 const lan = language.events.logs.guild;
 const con = emote.client.util.constants.events.logs.emoji;
 const audit = !emote.author
  ? await emote.client.util.getAudit(emote.guild, 60, emote.id)
  : undefined;
 const auditUser =
  emote.author ??
  (await emote.client.util.request.guilds
   .getEmoji(emote.guild, emote.id)
   .then((u) => ('message' in u || !u.author ? undefined : u.author))) ??
  audit?.executor ??
  undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.create,
   name: lan.emojiCreate,
  },
  description: auditUser ? lan.descEmojiCreateAudit(auditUser, emote) : lan.descEmojiCreate(emote),
  fields: [],
  color: CT.Colors.Success,
  timestamp: new Date().toISOString(),
 };

 const attachment = (await emote.client.util.fileURL2Buffer([emote.url]))?.[0];

 if (attachment) {
  files.push(attachment);

  embed.thumbnail = {
   url: `attachment://${emote.client.util.getNameAndFileType(emote.url)}`,
  };
 }

 emote.client.util.send(
  { id: channels, guildId: emote.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
