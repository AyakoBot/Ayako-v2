import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.emojis,
 createReason: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.emojis.createReason, {
   user,
  }),
 deleteReason: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.emojis.deleteReason, {
   user,
  }),
 editReason: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.emojis.editReason, {
   user,
  }),
 created: (e: Discord.GuildEmoji) =>
  t.stp(t.JSON.slashCommands.emojis.created, {
   e: t.languageFunction.getEmote(e),
  }),
 deleted: (e: Discord.GuildEmoji) =>
  t.stp(t.JSON.slashCommands.emojis.deleted, {
   e: t.languageFunction.getEmote(e),
  }),
 edited: (e: Discord.GuildEmoji) =>
  t.stp(t.JSON.slashCommands.emojis.edited, {
   e: t.languageFunction.getEmote(e),
  }),
});
