import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

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

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (
  Number(positionRole?.rawPosition) >=
   Number((await ch.getBotMemberFromGuild(cmd.guild))?.roles.highest.rawPosition) ||
  role.rawPosition >= Number((await ch.getBotMemberFromGuild(cmd.guild))?.roles.highest.rawPosition)
 ) {
  ch.errorCmd(cmd, language.errors.cantManageRole, language);
  return;
 }

 if (
  Number(positionRole?.rawPosition) >= cmd.member.roles.highest.rawPosition ||
  role.rawPosition >= cmd.member.roles.highest.rawPosition
 ) {
  ch.errorCmd(cmd, language.errors.cantManageRole, language);
  return;
 }

 if (Number.isNaN(parseInt(color as string, 16))) color = undefined;

 const emoji = iconEmoji ? Discord.parseEmoji(iconEmoji) : undefined;

 const editPositionRes = positionRole
  ? await ch.request.guilds.setRolePositions(cmd.guild, [
     {
      position: positionRole.position,
      id: role.id,
     },
    ])
  : undefined;

 if (editPositionRes && 'message' in editPositionRes) {
  ch.errorCmd(
   cmd,
   editPositionRes.message.includes('ENOENT')
    ? language.errors.emoteNotFound
    : editPositionRes.message,
   language,
  );
  return;
 }

 const editedRole = await ch.request.guilds.editRole(cmd.guild, role.id, {
  name,
  hoist,
  mentionable,
  unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
  color: color ? parseInt(color, 16) : undefined,
  icon:
   iconUrl ??
   icon?.url ??
   (iconEmoji && Discord.parseEmoji(iconEmoji)
    ? `https://cdn.discordapp.com/emojis/${Discord.parseEmoji(iconEmoji)?.id}.png`
    : undefined),
 });

 if ('message' in editedRole) {
  ch.errorCmd(
   cmd,
   editedRole.message.includes('ENOENT') ? language.errors.emoteNotFound : editedRole.message,
   language,
  );
 } else ch.replyCmd(cmd, { content: lan.edit(role as Discord.Role) });
};
