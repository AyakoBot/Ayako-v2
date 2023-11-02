import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('reset-levels')
 .setDescription('Reset Levels Utility Commands')
 .setDMPermission(false)
 .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageGuild)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('user')
   .setDescription('Reset Levels for a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User to reset Levels on')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('role')
   .setDescription('Reset Levels for all Members of a Role')
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role of Users to reset Levels on')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('all')
   .setDescription('Reset all Levels of all Members'),
 );
