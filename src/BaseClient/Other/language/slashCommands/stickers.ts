import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.stickers,
 createReason: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.stickers.createReason, {
   user,
  }),
 deleteReason: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.stickers.deleteReason, {
   user,
  }),
 editReason: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.stickers.editReason, {
   user,
  }),
 created: (s: Discord.Sticker) =>
  t.stp(t.JSON.slashCommands.stickers.created, {
   e: t.languageFunction.getSticker(s),
  }),
 deleted: (s: Discord.Sticker) =>
  t.stp(t.JSON.slashCommands.stickers.deleted, {
   e: t.languageFunction.getSticker(s),
  }),
 edited: (s: Discord.Sticker) =>
  t.stp(t.JSON.slashCommands.stickers.edited, {
   e: t.languageFunction.getSticker(s),
  }),
});
