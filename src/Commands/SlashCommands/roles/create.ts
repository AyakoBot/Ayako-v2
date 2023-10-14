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
 const iconUrl = cmd.options.getString('icon-url', false);

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (
  Number(positionRole?.rawPosition) >=
  Number((await ch.getBotMemberFromGuild(cmd.guild))?.roles.highest.rawPosition)
 ) {
  ch.errorCmd(cmd, language.errors.roleNotManageable, language);
  return;
 }

 if (Number(positionRole?.rawPosition) >= cmd.member.roles.highest.rawPosition) {
  ch.errorCmd(cmd, language.errors.cantManageRole, language);
  return;
 }

 if (Number.isNaN(parseInt(color as string, 16))) color = null;

 if (iconUrl) {
  try {
   new URL(iconUrl);
  } catch (e) {
   ch.errorCmd(cmd, e as Error, await ch.getLanguage(cmd.guildId));
   return;
  }
 }

 const emoji = iconEmoji ? Discord.parseEmoji(iconEmoji) : undefined;
 const parsedIcon =
  iconUrl ??
  icon?.url ??
  (iconEmoji && Discord.parseEmoji(iconEmoji)?.id
   ? `https://cdn.discordapp.com/emojis/${Discord.parseEmoji(iconEmoji)?.id}.png`
   : undefined);

 const role = await ch.request.guilds.createRole(
  cmd.guild,
  {
   name,
   unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
   color: color ? parseInt(color, 16) : undefined,
   icon:
    parsedIcon && cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)
     ? parsedIcon
     : undefined,
   permissions: permissionRole
    ? new Discord.PermissionsBitField(
       permissionRole?.permissions
        .toArray()
        .filter((p) => cmd.member.roles.highest.permissions.toArray().includes(p)),
      ).bitfield.toString()
    : undefined,
  },
  cmd.user.username,
 );

 if ('message' in role) {
  ch.errorCmd(
   cmd,
   role.message.includes('ENOENT') ? language.errors.emoteNotFound : role,
   language,
  );
  return;
 }

 ch.replyCmd(cmd, { content: lan.create(role) });

 if (positionRole) {
  await ch.request.guilds.setRolePositions(cmd.guild, [
   {
    position: positionRole.rawPosition,
    id: role.id,
   },
  ]);
 }
};
