import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.sticker,
 descCreateAudit: (sticker: Discord.Sticker, user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.sticker.descCreateAudit, {
   user: t.languageFunction.getUser(user),
   sticker: t.languageFunction.getSticker(sticker),
  }),
 descCreate: (sticker: Discord.Sticker) =>
  t.stp(t.JSON.events.logs.sticker.descCreate, {
   sticker: t.languageFunction.getSticker(sticker),
  }),
 descDeleteAudit: (sticker: Discord.Sticker, user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.sticker.descDeleteAudit, {
   user: t.languageFunction.getUser(user),
   sticker: t.languageFunction.getSticker(sticker),
  }),
 descDelete: (sticker: Discord.Sticker) =>
  t.stp(t.JSON.events.logs.sticker.descDelete, {
   sticker: t.languageFunction.getSticker(sticker),
  }),
 descUpdateAudit: (sticker: Discord.Sticker, user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.sticker.descUpdateAudit, {
   user: t.languageFunction.getUser(user),
   sticker: t.languageFunction.getSticker(sticker),
  }),
 descUpdate: (sticker: Discord.Sticker) =>
  t.stp(t.JSON.events.logs.sticker.descUpdate, {
   sticker: t.languageFunction.getSticker(sticker),
  }),
 format: {
  1: t.JSON.events.logs.sticker.format[1],
  2: t.JSON.events.logs.sticker.format[2],
  3: t.JSON.events.logs.sticker.format[3],
  4: t.JSON.events.logs.sticker.format[4],
 },
});
