import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['button-roles'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['button-roles'].fields,
  linkedid: t.JSON.linkedid,
 },
});
