import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('bypass')
 .setDescription('Bypasses a Member from the Verification-System')
 .setDMPermission(false)
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .addUserOption(
  new Discord.SlashCommandUserOption()
   .setName('user')
   .setDescription('The User to bypass')
   .setRequired(true),
 );
