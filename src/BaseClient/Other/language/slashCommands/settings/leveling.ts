import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.leveling,
 fields: {
  ...t.JSON.slashCommands.settings.categories.leveling.fields,
  xpmultiplier: t.JSON.multiplier,
 },
});
