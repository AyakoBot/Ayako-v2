import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories.invites,
 fields: {
  action: t.JSON.punishmentAction,
  duration: t.JSON.punishmentDuration,
  deletemessageseconds: t.JSON.punishmentDeleteMessageSeconds,
 },
});
