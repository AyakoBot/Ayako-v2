import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (emote: Discord.GuildEmoji) => {
 const channels = await ch.getLogChannels('emojievents', emote.guild);
 if (!channels) return;

 const language = await ch.getLanguage(emote.guild.id);
 const lan = language.events.logs.guild;
 const con = ch.constants.events.logs.emoji;
 const audit = !emote.author ? await ch.getAudit(emote.guild, 60, emote.id) : undefined;
 const auditUser =
  emote.author ??
  (await ch.request.guilds
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
  color: ch.constants.colors.success,
  timestamp: new Date().toISOString(),
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
