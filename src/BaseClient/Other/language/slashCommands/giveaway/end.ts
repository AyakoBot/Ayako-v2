import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.giveaway.end,
 limitedTime: (inTime: string, time: string) =>
  t.stp(t.JSON.slashCommands.giveaway.end.limitedTime, {
   inTime,
   time,
  }),
 until: (time: string) =>
  t.stp(t.JSON.slashCommands.giveaway.end.until, {
   time,
  }),
});
