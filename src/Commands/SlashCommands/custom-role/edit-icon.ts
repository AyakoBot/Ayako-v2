import * as Discord from 'discord.js';
import { getCustomRole, getSettings } from './create.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const settings = await getSettings(cmd);
 if (!settings) return;

 const { language, lan } = settings;

 if (!cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)) {
  cmd.client.util.errorCmd(cmd, lan.iconsNotAvailable, language);
  return;
 }

 const customRole = await getCustomRole(cmd, settings);
 if (!customRole) return;

 if (!settings.canseticon) {
  cmd.client.util.errorCmd(
   cmd,
   `${lan.cantSetIcon}\n\n${lan.limits(
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

 const icon = cmd.options.getAttachment('icon', false);
 const iconEmoji = cmd.options.getString('icon-emoji', false);
 const iconUrl = cmd.options.getString('icon-url', false);

 if (!icon && !iconEmoji && !iconUrl) {
  cmd.client.util.errorCmd(cmd, language.errors.noArguments, language);
  return;
 }

 const parsedIcon =
  iconUrl ??
  icon?.url ??
  (iconEmoji && Discord.parseEmoji(iconEmoji)?.id
   ? `https://cdn.discordapp.com/emojis/${Discord.parseEmoji(iconEmoji)?.id}.png`
   : undefined);

 const emoji = iconEmoji ? Discord.parseEmoji(iconEmoji) : undefined;

 if (iconUrl) {
  try {
   new URL(iconUrl);
  } catch (e) {
   cmd.client.util.errorCmd(cmd, e as Error, await cmd.client.util.getLanguage(cmd.guildId));
   return;
  }
 }

 const role = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  customRole.id,
  {
   unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
   icon:
    parsedIcon && cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)
     ? parsedIcon
     : undefined,
  },
  cmd.user.username,
 );

 if (!role || 'message' in role) {
  cmd.client.util.errorCmd(
   cmd,
   role.message.includes('ENOENT') ? language.errors.emoteNotFound : role.message,
   language,
  );
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
