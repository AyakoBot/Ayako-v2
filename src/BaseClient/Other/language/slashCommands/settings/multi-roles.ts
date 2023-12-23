import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['multi-roles'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['multi-roles'].fields,
  multiplier: t.JSON.multiplier,
 },
});
