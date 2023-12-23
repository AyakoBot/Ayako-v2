import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.verification,
 title: t.stp(t.JSON.verification.title, { t }),
 description: (guild: Discord.Guild) => t.stp(t.JSON.verification.description, { guild }),
 kickMsg: (guild: Discord.Guild) => t.stp(t.JSON.verification.kickMsg, { guild }),
 kickReason: t.stp(t.JSON.verification.kickReason, { t }),
 wrongInput: (solution: string) => t.stp(t.JSON.verification.wrongInput, { solution }),
 log: {
  ...t.JSON.verification.log,
  start: (user: Discord.User) =>
   t.stp(t.JSON.verification.log.start, { user: t.languageFunction.getUser(user) }),
  end: (user: Discord.User) =>
   t.stp(t.JSON.verification.log.end, { user: t.languageFunction.getUser(user) }),
 },
});
