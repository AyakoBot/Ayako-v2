import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true);
 let color = cmd.options.getString('color', false);
 const icon = cmd.options.getAttachment('icon', false);
 const iconEmoji = cmd.options.getString('icon-emoji', false);
 const positionRole = cmd.options.getRole('position-role', false);
 const permissionRole = cmd.options.getRole('permission-role', false);
 const iconUrl = cmd.options.getString('icon-url', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (
  Number(positionRole?.rawPosition) >=
  Number((await cmd.client.util.getBotMemberFromGuild(cmd.guild))?.roles.highest.rawPosition)
 ) {
  cmd.client.util.errorCmd(cmd, language.errors.roleNotManageable, language);
  return;
 }

 if (Number(positionRole?.rawPosition) >= cmd.member.roles.highest.rawPosition) {
  cmd.client.util.errorCmd(cmd, language.errors.cantManageRole, language);
  return;
 }

 if (Number.isNaN(parseInt(color as string, 16))) color = null;

 if (iconUrl) {
  try {
   new URL(iconUrl);
  } catch (e) {
   cmd.client.util.errorCmd(cmd, e as Error, await cmd.client.util.getLanguage(cmd.guildId));
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

 const role = await cmd.client.util.request.guilds.createRole(
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
    : new Discord.PermissionsBitField(0n).bitfield.toString(),
  },
  cmd.user.username,
 );

 if ('message' in role) {
  cmd.client.util.errorCmd(
   cmd,
   role.message.includes('ENOENT') ? language.errors.emoteNotFound : role,
   language,
  );
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.create(role) });

 if (positionRole) {
  await cmd.client.util.request.guilds.setRolePositions(cmd.guild, [
   {
    position: positionRole.rawPosition,
    id: role.id,
   },
  ]);
 }
};
