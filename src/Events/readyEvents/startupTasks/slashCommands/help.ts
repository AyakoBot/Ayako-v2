import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('help')
 .setDescription('Get Help for the Bot')
 .setDMPermission(true)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('list')
   .setDescription('See a list of all Commands and Categories'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('command')
   .setDescription('See Help for a specific Command')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('command')
     .setDescription('The Command to see Help for')
     .setRequired(true)
     .setAutocomplete(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('moderation')
   .setDescription('Help for the Moderation Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('info')
   .setDescription('Help for the Info Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('utility')
   .setDescription('Help for the Utility Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('leveling')
   .setDescription('Help for the Leveling Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('nitro')
   .setDescription('Help for the Nitro Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('vote')
   .setDescription('Help for the Vote Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('roles')
   .setDescription('Help for the Role Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('automation')
   .setDescription('Help for the Automation Commands'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('fun')
   .setDescription('Help for the Fun Commands'),
 );
