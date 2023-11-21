import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

const name = client.user?.username;

export default new Discord.SlashCommandBuilder()
 .setName('info')
 .setDescription('Display Information about anything on Discord')
 .setDMPermission(true)
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('invite')
   .setDescription('Display Information about an Invite')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('invite')
     .setDescription('The Invite you want to get Information about'),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('user')
   .setDescription('Display Information about a User')
   .addUserOption(
    new Discord.SlashCommandUserOption()
     .setName('user')
     .setDescription('The User')
     .setRequired(false),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('user-name')
     .setDescription(`Username of the User (Searches across all of ${name}'s Servers)`)
     .setRequired(false)
     .setMinLength(2)
     .setAutocomplete(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('servers')
   .setDescription(`Display all servers ${name} is part of`),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('server')
   .setDescription('Display Information about a Server')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setDescription('The ID of the Server')
     .setRequired(false)
     .setName('server-id'),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('server-name')
     .setDescription(`Name of the Server (Searches across all of ${name}'s Servers)`)
     .setRequired(false)
     .setMinLength(1)
     .setAutocomplete(true),
   )
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('server-invite')
     .setDescription('Invite to the Server')
     .setRequired(false)
     .setMinLength(1),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('channel')
   .setDescription('Display Information about a Channel')
   .addChannelOption(
    new Discord.SlashCommandChannelOption()
     .setName('channel')
     .setDescription('The Channel you want to get Information about')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('role')
   .setDescription('Display Information about a Role')
   .addRoleOption(
    new Discord.SlashCommandRoleOption()
     .setName('role')
     .setDescription('The Role you want to get Information about')
     .setRequired(true),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('bot')
   .setDescription(`Display Information about a ${name}`),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('badges')
   .setDescription('Display Information about the Discord Badges Members of this Server have'),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('emoji')
   .setDescription('Display Information about an Emoji')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('emoji')
     .setDescription('The Emoji you want to get Information about')
     .setRequired(false),
   ),
 )
 .addSubcommand(
  new Discord.SlashCommandSubcommandBuilder()
   .setName('sticker')
   .setDescription('Display Information about a Sticker')
   .addStringOption(
    new Discord.SlashCommandStringOption()
     .setName('sticker')
     .setDescription('A Message Link to the Sticker you want info about (can also be a Sticker ID)')
     .setRequired(false),
   ),
 );
