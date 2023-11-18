import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['role-rewards'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['role-rewards'].fields,
  xpmultiplier: t.JSON.multiplier,
 },
});
