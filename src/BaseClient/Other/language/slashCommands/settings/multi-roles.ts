import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['multi-roles'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['multi-roles'].fields,
  xpmultiplier: t.multiplier,
 },
});
