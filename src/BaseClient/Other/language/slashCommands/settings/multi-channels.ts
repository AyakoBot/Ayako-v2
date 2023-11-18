import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['multi-channels'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['multi-channels'].fields,
  xpmultiplier: t.multiplier,
 },
});
