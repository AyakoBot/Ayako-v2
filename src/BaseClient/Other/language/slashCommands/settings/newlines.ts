import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.newlines,
 fields: {
  ...t.JSON.slashCommands.settings.categories.newlines.fields,
  action: t.JSON.punishmentAction,
  duration: t.JSON.punishmentDuration,
  deletemessageseconds: t.JSON.punishmentDeleteMessageSeconds,
 },
});
