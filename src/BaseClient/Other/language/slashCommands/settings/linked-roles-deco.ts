import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['linked-roles-deco'],
 desc: (guildId: string, settingsId: number) =>
  t.stp(t.JSON.slashCommands.settings.categories['linked-roles-deco'].desc, {
   guildId,
   settingsId,
  }),
});
