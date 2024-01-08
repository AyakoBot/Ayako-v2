import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (sticker: Discord.Sticker) => {
 if (!sticker.guild) return;

 const channels = await sticker.client.util.getLogChannels('stickerevents', sticker.guild);
 if (!channels) return;

 const language = await sticker.client.util.getLanguage(sticker.guild.id);
 const lan = language.events.logs.sticker;
 const con = sticker.client.util.constants.events.logs.sticker;
 const audit = (await sticker.client.util.getAudit(sticker.guild, 90, sticker.id)) ?? undefined;
 const auditUser =
  audit?.executor ??
  sticker.user ??
  (await sticker.client.util.request.guilds
   .getSticker(sticker.guild, sticker.id)
   .then((s) => ('message' in s || !s.user ? undefined : s.user)));
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.create,
   name: lan.nameCreate,
  },
  description: auditUser ? lan.descCreateAudit(sticker, auditUser) : lan.descCreate(sticker),
  fields: [],
  color: CT.Colors.Success,
  timestamp: new Date().toISOString(),
 };

 const attachment = (await sticker.client.util.fileURL2Buffer([sticker.url]))?.[0];
 if (attachment) {
  files.push(attachment);

  embed.thumbnail = {
   url: `attachment://${sticker.client.util.getNameAndFileType(sticker.url)}`,
  };
 }

 if (sticker.description) {
  embed.fields?.push({
   name: lan.description,
   value: sticker.description,
  });
 }

 if (sticker.tags) {
  embed.fields?.push({
   name: lan.tags,
   value: `:${sticker.tags}:`,
  });
 }

 embed.fields?.push({
  name: lan.formatName,
  value: lan.format[sticker.format],
 });

 sticker.client.util.send(
  { id: channels, guildId: sticker.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
