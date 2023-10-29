import * as Discord from 'discord.js';

export default new Discord.ContextMenuCommandBuilder()
 .setName('Stick Message')
 .setDMPermission(false)
 .setDefaultMemberPermissions(Discord.PermissionsBitField.Flags.ManageMessages)
 .setType(Discord.ApplicationCommandType.Message);
