import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldSticker: Discord.Sticker, sticker: Discord.Sticker) => {
 if (!sticker.guild) return;

 const channels = await ch.getLogChannels('stickerevents', sticker.guild);
 if (!channels) return;

 const language = await ch.languageSelector(sticker.guild.id);
 const lan = language.events.logs.sticker;
 const con = ch.constants.events.logs.sticker;
 const audit = (await ch.getAudit(sticker.guild, 91, sticker.id)) ?? undefined;
 const auditUser = audit?.executor ?? (await sticker.fetchUser());
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.update,
   name: lan.nameUpdate,
  },
  description: auditUser ? lan.descUpdateAudit(sticker, auditUser) : lan.descUpdate(sticker),
  fields: [],
  color: ch.constants.colors.loading,
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  ch.mergeLogging(before, after, type, embed, language, name);

 if (oldSticker.description !== sticker.description) {
  merge(oldSticker.description, sticker.description, 'string', lan.description);
 }
 if (oldSticker.name !== sticker.name) {
  merge(oldSticker.name, sticker.name, 'string', language.name);
 }
 if (oldSticker.tags !== sticker.tags) {
  merge(`:${oldSticker.tags}:`, `:${sticker.tags}:`, 'string', lan.tags);
 }

 ch.send({ id: channels, guildId: sticker.guild.id }, { embeds: [embed], files }, undefined, 10000);
};
