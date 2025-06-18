import * as Discord from 'discord.js';
import { getContent } from '../../../Events/BotEvents/autoModerationActionEvents/censor.js';
import { getCustomRole, getSettings } from './create.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const settings = await getSettings(cmd);
 if (!settings) return;

 const { language, lan } = settings;

 const customRole = await getCustomRole(cmd, settings);
 if (!customRole) return;

 const name = cmd.options.getString('name', false);

 const role = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  customRole.id,
  {
   name: name
    ? await getContent(
       cmd.guild,
       name,
       undefined,
       undefined,
       undefined,
       cmd.member.roles.cache.map((r) => r),
      )
    : cmd.member.displayName,
  },
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
  content: `${lan.create(role)}\n\n${lan.limits({ icon: settings.canseticon, color: settings.cansetcolor, holo: settings.cansetholo, gradient: settings.cansetgradient }, await cmd.client.util.getCustomCommand(cmd.guild, 'custom-role').then((r) => r?.id || '0'))}`,
 });
};
