import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['multi-channels'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['multi-channels'].fields,
  multiplier: t.JSON.multiplier,
 },
});
