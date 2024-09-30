import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.settings.categories['linked-roles-deco'],
 apply: {
  ...t.JSON.slashCommands.settings.categories['linked-roles-deco'].apply,
  desc: (roleName: string) =>
   t.stp(t.JSON.slashCommands.settings.categories['linked-roles-deco'].apply.desc, {
    roleName,
   }),
 },
 desc: (guildId: string, settingsId: number, roleId: string) =>
  t.stp(t.JSON.slashCommands.settings.categories['linked-roles-deco'].desc, {
   guildId,
   settingsId,
   roleId,
  }),
});
