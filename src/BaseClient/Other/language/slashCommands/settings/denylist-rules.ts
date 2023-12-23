import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['denylist-rules'],
 desc: (kF: string, msF: string, sF: string, kpF: string, mF: string) =>
  t.stp(t.JSON.slashCommands.settings.categories['denylist-rules'].desc, { kF, msF, sF, kpF, mF }),
});
