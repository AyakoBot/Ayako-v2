import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const role = cmd.options.getRole('role', true);

 const name = cmd.options.getString('name', false) ?? undefined;
 let color = cmd.options.getString('color', false) ?? undefined;
 const hoist = cmd.options.getBoolean('hoist', false) ?? undefined;
 const icon = cmd.options.getAttachment('icon', false) ?? undefined;
 const iconEmoji = cmd.options.getString('icon-emoji', false) ?? undefined;
 const mentionable = cmd.options.getBoolean('mentionable', false) ?? undefined;
 const positionRole = cmd.options.getRole('position-role', false) ?? undefined;
 const iconUrl = cmd.options.getString('icon-url', false);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (
  Number(positionRole?.rawPosition) >=
   Number((await cmd.client.util.getBotMemberFromGuild(cmd.guild))?.roles.highest.rawPosition) ||
  role.rawPosition >=
   Number((await cmd.client.util.getBotMemberFromGuild(cmd.guild))?.roles.highest.rawPosition)
 ) {
  cmd.client.util.errorCmd(cmd, language.errors.cantManageRole, language);
  return;
 }

 if (
  Number(positionRole?.rawPosition) >= cmd.member.roles.highest.rawPosition ||
  role.rawPosition >= cmd.member.roles.highest.rawPosition
 ) {
  cmd.client.util.errorCmd(cmd, language.errors.cantManageRole, language);
  return;
 }

 if (Number.isNaN(parseInt(color as string, 16))) color = undefined;

 const emoji = iconEmoji ? Discord.parseEmoji(iconEmoji) : undefined;

 const editPositionRes = positionRole
  ? await cmd.client.util.request.guilds.setRolePositions(cmd.guild, [
     {
      position: positionRole.position,
      id: role.id,
     },
    ])
  : undefined;

 if (editPositionRes && 'message' in editPositionRes) {
  cmd.client.util.errorCmd(
   cmd,
   editPositionRes.message.includes('ENOENT') ? language.errors.emoteNotFound : editPositionRes,
   language,
  );
  return;
 }

 const editedRole = await cmd.client.util.request.guilds.editRole(cmd.guild, role.id, {
  name,
  hoist,
  mentionable,
  unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
  color: color ? parseInt(color, 16) : undefined,
  icon:
   iconUrl ??
   icon?.url ??
   (iconEmoji && Discord.parseEmoji(iconEmoji)?.id
    ? `https://cdn.discordapp.com/emojis/${Discord.parseEmoji(iconEmoji)?.id}.png`
    : undefined),
 });

 if ('message' in editedRole) {
  cmd.client.util.errorCmd(
   cmd,
   editedRole.message.includes('ENOENT') ? language.errors.emoteNotFound : editedRole,
   language,
  );
 } else cmd.client.util.replyCmd(cmd, { content: lan.edit(role as Discord.Role) });
};
