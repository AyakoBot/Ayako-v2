import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['vote-rewards'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['vote-rewards'].fields,
  linkedid: t.JSON.linkedid,
 },
});
