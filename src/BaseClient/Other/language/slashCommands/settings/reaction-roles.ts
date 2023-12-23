import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['reaction-roles'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['reaction-roles'].fields,
  linkedid: t.JSON.linkedid,
 },
});
