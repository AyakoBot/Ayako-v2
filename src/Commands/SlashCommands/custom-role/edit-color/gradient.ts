import * as Discord from 'discord.js';
import { getCustomRole, getSettings } from '../create.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const settings = await getSettings(cmd);
 if (!settings) return;

 const { language, lan } = settings;

 if (!cmd.guild.features.includes('ENHANCED_ROLE_COLORS')) {
  cmd.client.util.errorCmd(cmd, lan.gradientsNotAvailable, language);
  return;
 }

 const customRole = await getCustomRole(cmd, settings);
 if (!customRole) return;

 if (!settings.cansetgradient) {
  cmd.client.util.errorCmd(
   cmd,
   `${lan.cantSetGradient}\n\n${lan.limits(
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
 const color2 = cmd.options.getString('color-2', false);
 const colorRole2 = cmd.options.getRole('color-role-2', false);

 if (!color && !colorRole) {
  cmd.client.util.errorCmd(cmd, language.errors.noArguments, language);
  return;
 }

 if (color && !color.match(/[0-9a-f]+/i)?.length) {
  cmd.client.util.errorCmd(cmd, language.errors.invalidColor, language);
  return;
 }

 if (color2 && !color2.match(/[0-9a-f]+/i)?.length) {
  cmd.client.util.errorCmd(cmd, language.errors.invalidColor, language);
  return;
 }

 const parsedColor1 =
  colorRole?.color ||
  (color ? cmd.client.util.getColor(color.startsWith('#') ? color : `#${color}`) : undefined);

 const parsedColor2 =
  colorRole2?.color ||
  (color2 ? cmd.client.util.getColor(color2.startsWith('#') ? color2 : `#${color2}`) : undefined);

 const role = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  customRole.id,
  // TODO: wait for djs to document this
  {
   colors: {
    primary_color: parsedColor1 ?? undefined,
    secondary_color: parsedColor2 ?? undefined,
   },
  } as never,
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
