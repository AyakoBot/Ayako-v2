import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import shop from './roles/shop.js';
import customRole from './roles/customRole.js';
import builders from './roles/builders.js';
import _delete from './roles/delete.js';
import give from './roles/give.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles,
 create: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.roles.create, { role: t.languageFunction.getRole(role) }),
 edit: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.roles.edit, { role: t.languageFunction.getRole(role) }),
 shop: shop(t),
 customRole: customRole(t),
 builders: builders(t),
 delete: _delete(t),
 give: give(t),
});
