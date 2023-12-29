import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('rp')
 .setDescription('Allows Admins to manage RP-Commands and Users to block others')
 .setDMPermission(false)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('manager')
   .setDescription('Manage RP-Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('blocked')
   .setDescription('See Users you currently have blocked'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('block')
   .setDescription('Block a User from using RP-Commands on you')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('unblock')
   .setDescription('Unblock a User from using RP-Commands on you')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(true),
   ),
 );
