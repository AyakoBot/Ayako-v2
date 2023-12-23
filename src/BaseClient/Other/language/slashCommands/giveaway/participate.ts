import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.giveaway.participate,
 participants: (n: number) =>
  t.stp(t.JSON.slashCommands.giveaway.participate.participants, {
   n,
  }),
});
