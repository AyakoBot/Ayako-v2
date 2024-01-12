import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (oldSticker: Discord.Sticker, sticker: Discord.Sticker) => {
 if (!sticker.guild) return;

 const channels = await sticker.client.util.getLogChannels('stickerevents', sticker.guild);
 if (!channels) return;

 const language = await sticker.client.util.getLanguage(sticker.guild.id);
 const lan = language.events.logs.sticker;
 const con = sticker.client.util.constants.events.logs.sticker;
 const audit = (await sticker.client.util.getAudit(sticker.guild, 91, sticker.id)) ?? undefined;
 const auditUser =
  audit?.executor ??
  sticker.user ??
  (await sticker.client.util.request.guilds
   .getSticker(sticker.guild, sticker.id)
   .then((s) => ('message' in s || !s.user ? undefined : s.user)));
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.update,
   name: lan.nameUpdate,
  },
  description: auditUser ? lan.descUpdateAudit(sticker, auditUser) : lan.descUpdate(sticker),
  fields: [],
  color: CT.Colors.Loading,
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  sticker.client.util.mergeLogging(before, after, type, embed, language, name);

 if (oldSticker.description !== sticker.description) {
  merge(oldSticker.description, sticker.description, 'string', lan.description);
 }
 if (oldSticker.name !== sticker.name) {
  merge(oldSticker.name, sticker.name, 'string', language.t.name);
 }
 if (oldSticker.tags !== sticker.tags) {
  merge(`:${oldSticker.tags}:`, `:${sticker.tags}:`, 'string', lan.tags);
 }

 sticker.client.util.send(
  { id: channels, guildId: sticker.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
