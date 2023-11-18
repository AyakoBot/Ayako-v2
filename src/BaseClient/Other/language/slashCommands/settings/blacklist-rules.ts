import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['blacklist-rules'],
 desc: (kF: number, msF: number, sF: number, kpF: number) =>
  t.stp(t.JSON.slashCommands.settings.categories['blacklist-rules'].desc, { kF, msF, sF, kpF }),
});
