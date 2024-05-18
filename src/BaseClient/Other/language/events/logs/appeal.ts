import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.appeal,
 author: t.stp(t.JSON.events.appeal.author, { t }),
 acceptInstructions: t.stp(t.JSON.events.appeal.acceptInstructions, { t }),
 description: (user: Discord.User, id: string, cId: string) =>
  t.stp(t.JSON.events.appeal.description, {
   user: t.languageFunction.getUser(user),
   punishment: t.languageFunction.getPunishment(id, cId),
  }),
 notifications: {
  ...t.JSON.events.appeal.notifications,
  rejDesc: (id: string) => t.stp(t.JSON.events.appeal.notifications.rejDesc, { id }),
  accDesc: (id: string) => t.stp(t.JSON.events.appeal.notifications.accDesc, { id }),
 },
});
