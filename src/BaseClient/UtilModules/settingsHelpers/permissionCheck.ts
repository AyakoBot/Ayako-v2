import {
 PermissionFlagsBits,
 PermissionsBitField,
 type ButtonInteraction,
 type ChatInputCommandInteraction,
 type PermissionResolvable,
} from 'discord.js';

export default (
 cmd: ChatInputCommandInteraction<'cached'> | ButtonInteraction<'cached'>,
 permissions: PermissionResolvable = PermissionFlagsBits.ManageGuild,
): boolean => {
 if (!cmd.memberPermissions.has(permissions)) {
  cmd.client.util.permError(cmd, new PermissionsBitField(permissions).bitfield, false, false);
  return false;
 }
 return true;
};
