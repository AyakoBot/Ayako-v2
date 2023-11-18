import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.pardon,
 pardoned: (id: string, targetID: string) =>
  t.stp(t.JSON.slashCommands.pardon.pardoned, { id, targetID }),
 pardonedMany: (ids: string, targetID: string) =>
  t.stp(t.JSON.slashCommands.pardon.pardonedMany, { ids, targetID }),
 pardonedManyBy: (ids: string, targetID: string) =>
  t.stp(t.JSON.slashCommands.pardon.pardonedManyBy, { ids, targetID }),
});
