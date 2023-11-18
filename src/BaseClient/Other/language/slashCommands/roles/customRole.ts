import * as Discord from 'discord.js';
import * as ch from '../../../../ClientHelper.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.customRole,
 edit: (role: Discord.Role, limit: { icon: boolean; color: boolean }) =>
  t.stp(t.JSON.slashCommands.roles.customRole.edit, {
   role: t.languageFunction.getRole(role),
   icon: ch.constants.standard.getEmote(limit.icon ? ch.emotes.enabled : ch.emotes.disabled),
   color: ch.constants.standard.getEmote(limit.color ? ch.emotes.enabled : ch.emotes.disabled),
  }),
 create: (role: Discord.Role, limit: { icon: boolean; color: boolean }) =>
  t.stp(t.JSON.slashCommands.roles.customRole.create, {
   role: t.languageFunction.getRole(role),
   icon: ch.constants.standard.getEmote(limit.icon ? ch.emotes.enabled : ch.emotes.disabled),
   color: ch.constants.standard.getEmote(limit.color ? ch.emotes.enabled : ch.emotes.disabled),
  }),
});
