import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.pardon,
 pardoned: (id: string, targetId: string) =>
  t.stp(t.JSON.slashCommands.pardon.pardoned, { id, targetId }),
 pardonedMany: (ids: string, targetId: string) =>
  t.stp(t.JSON.slashCommands.pardon.pardonedMany, { ids, targetId }),
 pardonedManyBy: (ids: string, targetId: string) =>
  t.stp(t.JSON.slashCommands.pardon.pardonedManyBy, { ids, targetId }),
});
