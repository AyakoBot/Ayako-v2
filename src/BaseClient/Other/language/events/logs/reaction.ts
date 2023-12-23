import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.reaction,
 descAdded: (emoji: Discord.Emoji, user: Discord.User, msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.reaction.descAdded, {
   user: t.languageFunction.getUser(user),
   emoji: t.languageFunction.getEmote(emoji),
   msg: t.languageFunction.getMessage(msg),
  }),
 descRemoved: (emoji: Discord.Emoji, user: Discord.User, msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.reaction.descRemoved, {
   user: t.languageFunction.getUser(user),
   emoji: t.languageFunction.getEmote(emoji),
   msg: t.languageFunction.getMessage(msg),
  }),
 descRemovedAll: (msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.reaction.descRemovedAll, {
   msg: t.languageFunction.getMessage(msg),
  }),
 descRemoveEmoji: (msg: Discord.Message, emoji: Discord.Emoji) =>
  t.stp(t.JSON.events.logs.reaction.descRemoveEmoji, {
   emoji: t.languageFunction.getEmote(emoji),
   msg: t.languageFunction.getMessage(msg),
  }),
});
