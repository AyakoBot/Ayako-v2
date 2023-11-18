import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.giveaway.create,
 winners: (n: number) =>
  t.stp(t.JSON.slashCommands.giveaway.create.winners, {
   n,
  }),
 end: (e: string) =>
  t.stp(t.JSON.slashCommands.giveaway.create.end, {
   e,
  }),
 host: (u: Discord.User) =>
  t.stp(t.JSON.slashCommands.giveaway.create.host, {
   u,
  }),
 sent: (channel: Discord.Channel) =>
  t.stp(t.JSON.slashCommands.giveaway.create.sent, {
   channel,
  }),
 author: t.stp(t.JSON.slashCommands.giveaway.create.author, { t }),
});
