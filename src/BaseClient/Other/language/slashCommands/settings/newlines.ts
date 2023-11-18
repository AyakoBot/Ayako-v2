import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.newlines,
 fields: {
  ...t.JSON.slashCommands.settings.categories.newlines.fields,
  action: t.punishmentAction,
  duration: t.punishmentDuration,
  deletemessageseconds: t.punishmentDeleteMessageSeconds,
 },
});
