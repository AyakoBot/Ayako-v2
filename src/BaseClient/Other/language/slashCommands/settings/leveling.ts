import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.leveling,
 fields: {
  ...t.JSON.slashCommands.settings.categories.leveling.fields,
  xpmultiplier: t.JSON.multiplier,
 },
});
