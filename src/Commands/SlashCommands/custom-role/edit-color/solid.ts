import * as Discord from 'discord.js';
import { getCustomRole, getSettings } from '../create.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const settings = await getSettings(cmd);
 if (!settings) return;

 const { language, lan } = settings;

 const customRole = await getCustomRole(cmd, settings);
 if (!customRole) return;

 if (!settings.cansetcolor) {
  cmd.client.util.errorCmd(
   cmd,
   `${lan.cantSetColor}\n\n${lan.limits(
    {
     icon: settings.canseticon,
     color: settings.cansetcolor,
     holo: settings.cansetholo,
     gradient: settings.cansetgradient,
    },
    await cmd.client.util.getCustomCommand(cmd.guild, 'custom-role').then((r) => r?.id || '0'),
   )}`,
   language,
  );
  return;
 }

 const color = cmd.options.getString('color', false);
 const colorRole = cmd.options.getRole('color-role', false);

 if (!color && !colorRole) {
  cmd.client.util.errorCmd(cmd, language.errors.noArguments, language);
  return;
 }

 if (color && !color.match(/[0-9a-f]+/i)?.length) {
  cmd.client.util.errorCmd(cmd, language.errors.invalidColor, language);
  return;
 }

 const parsedColor =
  colorRole?.color ||
  (color ? cmd.client.util.getColor(color.startsWith('#') ? color : `#${color}`) : undefined);

 const role = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  customRole.id,
  { color: parsedColor ?? undefined },
  cmd.user.username,
 );

 if (!role || 'message' in role) {
  cmd.client.util.errorCmd(cmd, role.message, language);
  return;
 }

 cmd.client.util.roleManager.add(
  cmd.member,
  [role.id],
  language.events.guildMemberUpdate.rewards.customRoleName,
 );

 cmd.client.util.replyCmd(cmd, {
  content: `${lan.edit(role)}\n\n${lan.limits(
   {
    icon: settings.canseticon,
    color: settings.cansetcolor,
    holo: settings.cansetholo,
    gradient: settings.cansetgradient,
   },
   await cmd.client.util.getCustomCommand(cmd.guild, 'custom-role').then((r) => r?.id || '0'),
  )}`,
 });
};
