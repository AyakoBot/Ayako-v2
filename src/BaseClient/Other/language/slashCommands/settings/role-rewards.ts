import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['role-rewards'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['role-rewards'].fields,
  xpmultiplier: t.JSON.multiplier,
 },
});
