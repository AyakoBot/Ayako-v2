import {
 ComponentType,
 SelectMenuDefaultValueType,
 UserSelectMenuInteraction,
 type ChatInputCommandInteraction,
} from 'discord.js';

export default async (cmd: UserSelectMenuInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.customRole;

 const settings = await getApplyingSettings(cmd);
 if (!settings) return;

 const role = await cmd.client.util.DataBase.customroles.update({
  where: { guildid_userid: { guildid: cmd.guildId, userid: cmd.user.id } },
  data: { shared: cmd.values },
 });
 if (!role) {
  cmd.client.util.errorCmd(cmd, lan.share.noRole, language);
  return;
 }

 cmd.update({
  components: [
   {
    type: ComponentType.ActionRow,
    components: [
     {
      type: ComponentType.UserSelect,
      customId: 'custom-role/share',
      placeholder: lan.share.placeholder,
      minValues: 0,
      maxValues: Number(settings.maxShare),
      defaultValues: role.shared.map((id) => ({ type: SelectMenuDefaultValueType.User, id })),
     },
    ],
   },
  ],
 });

 const roleMembers = cmd.guild.members.cache.filter((m) => m.roles.cache.has(role.roleid));
 const membersRemoved = [
  ...roleMembers.filter((m) => !cmd.values.includes(m.id)).map((m) => m),
  cmd.guild.members.cache.get(cmd.user.id)!,
 ].filter((m) => m.id !== cmd.user.id);

 membersRemoved.forEach((m) => {
  cmd.client.util.roleManager.remove(m, [role.roleid], language.autotypes.customroles);
 });
};

export const getApplyingSettings = async (
 cmd: ChatInputCommandInteraction | UserSelectMenuInteraction,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.customRole;

 const settings = await cmd.client.util.DataBase.rolerewards.findMany({
  where: { guildid: cmd.guildId, active: true, customrole: true },
 });
 if (!settings.length) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const applyingSettings = settings.find(
  (s) =>
   s.roles.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.blroleid.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.bluserid.includes(cmd.user.id),
 );

 if (!applyingSettings) {
  cmd.client.util.errorCmd(cmd, lan.cantSet, language);
  return;
 }

 if (!applyingSettings.maxShare) {
  cmd.client.util.errorCmd(cmd, lan.share.cantShare, language);
  return;
 }

 return applyingSettings;
};
