import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.separators,
 oneTimeRunner: {
  ...t.JSON.slashCommands.settings.categories.separators.oneTimeRunner,
  stats: (r: number, members: number, finishTime: string) =>
   t.stp(t.JSON.slashCommands.settings.categories.separators.oneTimeRunner.stats, {
    r,
    members,
    finishTime,
   }),
 },
});
