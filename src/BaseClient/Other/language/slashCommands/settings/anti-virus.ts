import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['anti-virus'],
 fields: {
  ...t.JSON.slashCommands.settings.categories['anti-virus'].fields,
  action: t.punishmentAction,
  duration: t.punishmentDuration,
  deletemessageseconds: t.punishmentDeleteMessageSeconds,
 },
});
