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

 if (!settings.cansetholo) {
  cmd.client.util.errorCmd(
   cmd,
   `${lan.cantSetHolo}\n\n${lan.limits(
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

 const role = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  customRole.id,
  // TODO: wait for djs to document this
  {
   colors: {
    primary_color: 11127295,
    secondary_color: 16759788,
    tertiary_color: 16761760,
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
