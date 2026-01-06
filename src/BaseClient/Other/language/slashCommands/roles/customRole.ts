import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.customRole,
 alreadyExists: (cmdId: string) =>
  t.stp(t.JSON.slashCommands.roles.customRole.alreadyExists, { cmdId }),
 notExists: (cmdId: string) => t.stp(t.JSON.slashCommands.roles.customRole.notExists, { cmdId }),
 edit: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.roles.customRole.edit, {
   role: t.languageFunction.getRole(role),
  }),
 create: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.roles.customRole.create, {
   role: t.languageFunction.getRole(role),
  }),
 deleted: (role: Discord.Role) =>
  t.stp(t.JSON.slashCommands.roles.customRole.deleted, {
   role: t.languageFunction.getRole(role),
  }),
 limits: (
  limit: { icon: boolean; color: boolean; holo: boolean; gradient: boolean },
  cmdId: string,
 ) =>
  t.stp(t.JSON.slashCommands.roles.customRole.limits, {
   icon: t.util.constants.standard.getEmote(
    limit.icon ? t.util.emotes.enabled : t.util.emotes.disabled,
   ),
   color: t.util.constants.standard.getEmote(
    limit.color ? t.util.emotes.enabled : t.util.emotes.disabled,
   ),
   gradient: t.util.constants.standard.getEmote(
    limit.gradient ? t.util.emotes.enabled : t.util.emotes.disabled,
   ),
   holo: t.util.constants.standard.getEmote(
    limit.holo ? t.util.emotes.enabled : t.util.emotes.disabled,
   ),
   cmdId,
  }),
 share: {
  ...t.JSON.slashCommands.roles.customRole.share,
  desc: (amount: number) =>
   t.stp(t.JSON.slashCommands.roles.customRole.share.desc, { amount: String(amount), t }),
  claimed: (role: Discord.Role) =>
   t.stp(t.JSON.slashCommands.roles.customRole.share.claimed, {
    role: t.languageFunction.getRole(role),
   }),
  unequip: (role: Discord.Role) =>
   t.stp(t.JSON.slashCommands.roles.customRole.share.unequip, {
    role: t.languageFunction.getRole(role),
   }),
 },
});
