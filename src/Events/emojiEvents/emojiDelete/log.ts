import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (emote: Discord.GuildEmoji) => {
 const channels = await ch.getLogChannels('emojievents', emote.guild);
 if (!channels) return;

 const language = await ch.languageSelector(emote.guild.id);
 const lan = language.events.logs.guild;
 const con = ch.constants.events.logs.emoji;
 const audit = await ch.getAudit(emote.guild, 62, emote.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.delete,
   name: lan.emojiDelete,
  },
  description: auditUser ? lan.descEmojiDeleteAudit(auditUser, emote) : lan.descEmojiDelete(emote),
  fields: [],
  color: ch.constants.colors.danger,
 };

 const attachment = (await ch.fileURL2Buffer([emote.url]))?.[0];
 if (attachment) {
  files.push(attachment);

  embed.thumbnail = {
   url: `attachment://${ch.getNameAndFileType(emote.url)}`,
  };
 }

 ch.send({ id: channels, guildId: emote.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
