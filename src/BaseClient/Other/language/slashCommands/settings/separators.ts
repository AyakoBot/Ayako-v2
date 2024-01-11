import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.separators,
 oneTimeRunner: {
  ...t.JSON.slashCommands.settings.categories.separators.oneTimeRunner,
  notice: (cmdId: string) =>
   t.stp(t.JSON.slashCommands.settings.categories.separators.oneTimeRunner.notice, { cmdId }),
  stats: (members: number | string, r: number | string, finishTime: string) =>
   t.stp(t.JSON.slashCommands.settings.categories.separators.oneTimeRunner.stats, {
    r,
    members,
    finishTime,
   }),
 },
});
