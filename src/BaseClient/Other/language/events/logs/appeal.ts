import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.appeal,
 author: t.stp(t.JSON.events.appeal.author, { t }),
 description: (user: Discord.User, id: string, cId: string) =>
  t.stp(t.JSON.events.appeal.description, {
   user: t.languageFunction.getUser(user),
   punishment: t.languageFunction.getPunishment(id, cId),
  }),
});
