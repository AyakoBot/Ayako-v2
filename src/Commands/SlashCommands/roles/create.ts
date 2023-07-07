import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true);
 let color = cmd.options.getString('color', false);
 const icon = cmd.options.getAttachment('icon', false);
 const iconEmoji = cmd.options.getString('icon-emoji', false);
 const positionRole = cmd.options.getRole('position-role', false);
 const permissionRole = cmd.options.getRole('permission-role', false);

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (Number(positionRole?.rawPosition) >= Number(cmd.guild.members.me?.roles.highest.rawPosition)) {
  ch.errorCmd(cmd, language.errors.roleNotManageable, language);
  return;
 }

 if (Number(positionRole?.rawPosition) >= cmd.member.roles.highest.rawPosition) {
  ch.errorCmd(cmd, language.errors.cantManageRole, language);
  return;
 }

 if (Number.isNaN(parseInt(color as string, 16))) color = null;

 const emoji = iconEmoji ? Discord.parseEmoji(iconEmoji) : undefined;

 const role = await cmd.guild.roles
  .create({
   name,
   unicodeEmoji: !emoji || emoji.id ? undefined : emoji.name,
   color: color ? parseInt(color, 16) : undefined,
   icon:
    icon?.url ??
    (iconEmoji && Discord.parseEmoji(iconEmoji)
     ? `https://cdn.discordapp.com/emojis/${Discord.parseEmoji(iconEmoji)?.id}.png`
     : undefined),
   position: positionRole?.position,
   permissions: permissionRole?.permissions,
  })
  .catch((e) => e as Discord.DiscordAPIError);

 if ('message' in role) {
  ch.errorCmd(
   cmd,
   role.message.includes('ENOENT') ? language.errors.emoteNotFound : role.message,
   language,
  );
 } else ch.replyCmd(cmd, { content: lan.create(role as Discord.Role) });
};
