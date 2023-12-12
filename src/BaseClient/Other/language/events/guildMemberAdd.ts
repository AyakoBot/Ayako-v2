import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.guildMemberAdd,
 antiraid: {
  ...t.JSON.events.guildMemberAdd.antiraid,
  desc: (totalAmount: number, susAmount: number) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.desc, {
    totalAmount: totalAmount || '0',
    susAmount: susAmount || '0',
   }),
  invitesDisabled: (endTime: string) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.invitesDisabled, { time: endTime }),
  kicking: (amount: number) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.kicking, { amount: amount || '0' }),
  banning: (amount: number) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.banning, { amount: amount || '0' }),
  banningSuccess: (amount: number) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.banningSuccess, { amount: amount || '0' }),
  kickingSuccess: (amount: number) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.kickingSuccess, { amount: amount || '0' }),
  banningError: (amount: number) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.banningError, { amount: amount || '0' }),
  kickingError: (amount: number) =>
   t.stp(t.JSON.events.guildMemberAdd.antiraid.kickingError, { amount: amount || '0' }),
 },
});
