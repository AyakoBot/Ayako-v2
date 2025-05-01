import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.application,
 descUpdateCommand: (
  application: Discord.User | Discord.PartialUser,
  user: Discord.User | Discord.PartialUser,
  command: Discord.ApplicationCommand,
 ) =>
  t.stp(t.JSON.events.logs.application.descUpdateCommand, {
   user: t.languageFunction.getUser(user),
   application: t.languageFunction.getUser(application),
   command: t.languageFunction.getCommand(command),
  }),
 descUpdateAll: (application: Discord.User | Discord.PartialUser, user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.application.descUpdateAll, {
   user: t.languageFunction.getUser(user),
   application: t.languageFunction.getUser(application),
  }),
});
