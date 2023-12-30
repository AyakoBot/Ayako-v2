import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.rp,
 desc: t.stp(t.JSON.slashCommands.rp.desc, { t }),
 author: t.stp(t.JSON.slashCommands.rp.author, { t }),
 notBlocked: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.rp.notBlocked, {
   user: t.languageFunction.getUser(user),
  }),
 unblocked: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.rp.unblocked, {
   user: t.languageFunction.getUser(user),
  }),
 blocked: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.rp.blocked, {
   user: t.languageFunction.getUser(user),
  }),
 fields: (time: string, used: number) => [
  {
   name: t.JSON.slashCommands.rp.fields[0].name,
   value: t.stp(t.JSON.slashCommands.rp.fields[0].value, { time }),
  },
  {
   name: t.JSON.slashCommands.rp.fields[1].name,
   value: t.stp(t.JSON.slashCommands.rp.fields[1].value, { used: used || '0' }),
  },
 ],
 notice: (cmdId: string) =>
  t.stp(t.JSON.slashCommands.rp.notice, {
   cmdId,
  }),
 willTake: (time: string) => t.stp(t.JSON.slashCommands.rp.willTake, { time }),
});
