import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.giveaway.participate,
 participants: (n: number) =>
  t.stp(t.JSON.slashCommands.giveaway.participate.participants, {
   n,
  }),
});
